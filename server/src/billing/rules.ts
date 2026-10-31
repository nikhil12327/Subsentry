export const money=(value:number)=>Math.round((value+Number.EPSILON)*100)/100;

/** Compute the next period from the current period, preserving the subscription's original day anchor. */
export function nextBillingDate(date:Date,frequency:string,anchorDay:number):Date{
 const next=new Date(date);
 if(frequency==='DAILY'){next.setUTCDate(next.getUTCDate()+1);return next}
 if(frequency==='WEEKLY'){next.setUTCDate(next.getUTCDate()+7);return next}
 const months=frequency==='YEARLY'?12:1;
 const year=next.getUTCFullYear(),month=next.getUTCMonth();
 const lastDay=new Date(Date.UTC(year,month+months+1,0)).getUTCDate();
 return new Date(Date.UTC(year,month+months,Math.min(anchorDay,lastDay)));
}

/** Apply active exclusive percentage tax rates to a subtotal using cent-rounded results. */
export function calculateTax(subtotal:number,rates:number[]):number{
 const cents=Math.round(money(subtotal)*100);
 return money(rates.reduce((sum,rate)=>sum+Math.round(cents*rate/100),0)/100);
}
