import React from "react";
import MUIDataTable from "mui-datatables";
import {Grid,} from "@material-ui/core";

//Import Charts
import {ResponsiveContainer} from "recharts";
import DailyJoinedUserChart from "../charts/components/DailyJoinedUserChart";
import DailyJoinedVendors from "../charts/components/DailyJoinedVendors";
import TotalOrdersChart from "../charts/components/TotalOrdersChart";

//small Charts
import TotalOrderLineChart from './components/TotalOrderLineChart';
import TotalTransactionLineChart from "./components/TotalTransactionLineChart";
import TotalProductLineChart from "./components/TotalProductLineChart";
import TotalUsersBarChart from "./components/TotalUsersBarChart";

//grapql BackEnd
import { useQuery } from '@apollo/client';

// styles
import useStyles from "./styles";

//componets
import Widget from "../../components/Widget";
import PageTitle from "../../components/PageTitle";
import { Typography } from "../../components/Wrappers";


//graphQl Queries
import {GET_orders,GET_users,GET_Vendors} from '../data/DataQuery';


export default function Dashboard(props) {
  var classes = useStyles();
  let allOrders =[]
  let pendingOrders=[]
  let deliveredOrders=[]
  let totalPriceFromcash=0;
  let totalPriceFromOnline=0;

  //usersData
  let userCount=0
  const GetusersData =()=>{
    const {data} = useQuery(GET_users )
    return data
  }
  const userdata=GetusersData()
  if(userdata){userCount=userdata.users.length}

  //vendorsData
  let vendorsCount=0
  const GetvendorsData =()=>{
    const {data} = useQuery(GET_Vendors )
    return data
  }
  const vendorsdata=GetvendorsData()
  if(vendorsdata){vendorsCount=vendorsdata.vendors.length}

  
  
  //ordersdata
  const GetOrdersData =()=>{
    const {data} = useQuery(GET_orders )
    return data
  }
  const orders_data= GetOrdersData();
  
 
  if(orders_data){
    allOrders= orders_data.orders;
    pendingOrders = allOrders.filter((item)=>item.status==='pending')
    deliveredOrders= allOrders.filter((item)=>item.status==='delivered')

    allOrders.map((item)=>{
      if(item.paymentMethod !== 'cashOnDelivery'){
        totalPriceFromOnline=totalPriceFromOnline+item.totalPrice
        return null
      }else{
        totalPriceFromcash=totalPriceFromcash+item.totalPrice
        return null
      }
    })
   
  }
  //Fetch TodaysOrder
  let currentDateAndTimeObject= new Date(Date.now())
  let TodaysOrders=[]; 
  let CurrentdateAndTimestring =`${currentDateAndTimeObject.getDate()}.${currentDateAndTimeObject.getMonth()}.${currentDateAndTimeObject.getFullYear()}`

  if(orders_data){
    orders_data.orders.forEach(order => {
      let dateAndtimeObject=new Date(order.createAt._seconds *1000)
      let dateAndTimestring =`${dateAndtimeObject.getDate()}.${dateAndtimeObject.getMonth()}.${dateAndtimeObject.getFullYear()}`
      if(dateAndTimestring===CurrentdateAndTimestring){
        TodaysOrders.push(order)
      }
    });
  }
  
 
  return (
    <>
      <PageTitle title="Dashboard" />
      <Grid container spacing={4}>
        <TotalOrderLineChart totalOrdersLength={allOrders.length} pendingOrderslength={pendingOrders.length} deliveredOrderslength={deliveredOrders.length} />
        < TotalTransactionLineChart totalPriceFromcash={totalPriceFromcash} totalPriceFromOnline={totalPriceFromOnline}/>
        <TotalProductLineChart vendorCount={vendorsCount}/>
        < TotalUsersBarChart userCount={userCount} vendorsCount={vendorsCount}/>

        <Grid item lg={6} xs={12}>
          <Widget
            bodyClass={classes.mainChartBody}
            header={
              <div className={classes.mainChartHeader}>
                <Typography
                  variant="h5"
                  color="text"
                  colorBrightness="secondary"
                >
                  Daily Joined Vendors
                </Typography>
              </div>
            }
          >
            <ResponsiveContainer width="100%" minWidth={500} height={350}>
                <DailyJoinedVendors/> 
            </ResponsiveContainer>
            
          </Widget>
        </Grid>

        <Grid item lg={6} xs={12}>
          <Widget
            bodyClass={classes.mainChartBody}
            header={
              <div className={classes.mainChartHeader}>
                <Typography
                  variant="h5"
                  color="text"
                  colorBrightness="secondary"
                >
                  Daily Joined customers
                </Typography>
              </div>
            }
          >
            <ResponsiveContainer width="100%" minWidth={500} height={350}>
                <DailyJoinedUserChart/> 
            </ResponsiveContainer>
            
          </Widget>
        </Grid>
       
       
      <Grid item lg={12} xs={12}>
        <Widget
          bodyClass={classes.mainChartBody}
          header={
            <div className={classes.mainChartHeader}>
              <Typography
                variant="h5"
                color="text"
                colorBrightness="secondary"
              >
                Total Orders
              </Typography>
            </div>
          }
        >
          <ResponsiveContainer width="100%" minWidth={500} height={350}>
              <TotalOrdersChart/>
          </ResponsiveContainer>
        </Widget>
      </Grid>

      <Grid item xs={12}>
        <MUIDataTable
           title="Todays Order"
          data={TodaysOrders}
          columns={["id", "totalPrice", "paymentMethod", "status",'customerId']}
          options={{
            selectableRows:false
          }}
        />
      </Grid>
        
      </Grid>
    </>
  );
}






