'use client';

import Axios from 'axios';
import Apiconnect from '@/services/Apiconnect'; 
import { DEFAULT_RECORDS_PER_PAGE, DEBOUNCE_DELAY } from '@/constants/config';

import { ToastContainer, toast } from 'react-toastify';


class HelperCodebase {    

    async fetch_listdata(api_endpoint,params) {
         
        try {
            const response = await Apiconnect.postData(api_endpoint,params);
            if (response.data?.data) {
                return {
                    success: true,
                    apiinfo: response.data
                };
            } else {
                return {
                success: false,
                message: response.data?.message || "Failed to fetch states"
                };
            }
        } catch (error) {
        console.error("Error in HelperCodebase.fetchStates:", error);
        return {
            success: false,
            message: "An error occurred while fetching states"
        };
        }
    }
    getSerialNumber = (pageno,index)=>{         
        return (pageno - 1) * DEFAULT_RECORDS_PER_PAGE + index + 1;  
    }
    async handleDelete(deldata_id,deldata_name,api_endpoint,callback_function) {
      const isConfirmed = window.confirm(`Are you sure you want to delete ${deldata_name}?`);
      if (!isConfirmed) {
        return;
      }
    
      try {
        const response = await Apiconnect.deleteData(`${api_endpoint}/${deldata_id}`); 
        console.log("Deleted:", response);
        toast.success(response.data.message);
        callback_function();
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
    async loadInfo(list_api,pageno,searchTerm,setIsLoading,setApiinfo){
        setIsLoading(true);
        const params = {
            limit: DEFAULT_RECORDS_PER_PAGE,
            offset: (pageno-1)*DEFAULT_RECORDS_PER_PAGE,
        };
        if(searchTerm!=""){
            params.search = searchTerm;
        }
        const result = await this.fetch_listdata(list_api,params);
        if (result.success) {
            setApiinfo(result.apiinfo);            
        } else {
            alert(result.message);
        }
        setIsLoading(false);
    }
    

















    array_search_multidim = (kk,vv,z)=>{
        var out =[];
        var ln = Object.keys(z).length;
        for (var i = 0; i < ln; i++) {
            var itm = z[i];
            if(itm[kk] == vv){
                out.push(itm);
            } 
        }
        return out;  
    }


    daysInMonth (year, month) {
        return new Date(year, month, 0).getDate();
    }

    

    starmaker (nn) {
        var mm ='<i class="fa fa-star"  ></i>';
         mm +='<i class="fa fa-star"  ></i>';
        return  mm;
    }

    getSundays(year, month) {

        var day, counter, date;
    
        day = 1;
        counter = 0;
        date = new Date(year, month, day);
        while (date.getMonth() === month) {
            if (date.getDay() === 0) { // Sun=0, Mon=1, Tue=2, etc.
                counter += 1;
            }
            day += 1;
            date = new Date(year, month, day);
        }
        return counter;
    }

    formatDate_ymd(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
    
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
    
        return [year, month, day].join('-');
    }

    add_days(curdt,numz) {
        var tt = new Date(curdt.getTime()+(parseInt(numz)*24*60*60*1000));
        
        return  this.formatDate_ymd(tt);
        
    }







    
    dummy = (txt) => {        
        return '-00000------';
    }
    weekdata = ()=>{
        return '-00000------'; 
    }
    

  }
  
  export default new HelperCodebase();
  