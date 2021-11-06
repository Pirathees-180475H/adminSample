import React from "react";
import { Grid } from "@material-ui/core";
import MUIDataTable from "mui-datatables";

//grapql import
import { useQuery} from '@apollo/client';

import {GET_users} from '../data/DataQuery';

let datatableData = [];

export default function Tables() {
  function GetUsersData(){
    const {loading,error,data} = useQuery(GET_users)
    return data
  }
  const users_data= GetUsersData();
  
  if(users_data){
    datatableData= users_data.users;
    console.log(users_data)
  }

  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <MUIDataTable
            title="customers List"
            data={datatableData}
            columns={["username", "email", "mobile", "paymentMethod",'language','lastname',"id"]}
            options={{
            filterType: "checkbox",
            downloadOptions:{
            filterOptions:{
            useDisplayedColumnsOnly:true,
            useDisplayedRowsOnly:true
            }
              },
            selectableRows:false
            }}
          />
        </Grid>
      </Grid>
    </>
  );
}
