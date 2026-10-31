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

/** Resolve "Net 15" style payment terms to a number of days (defaults to 15, clamped 1..365). */
export function paymentTermsDays(terms:string|null|undefined):number{
 const m=/^net\s+(\d+)$/i.exec(String(terms||'').trim());
 if(!m)return 15;
 const n=Number(m[1]);
 return n>=1&&n<=365?n:15;
}

/** UTC offset in ms of an IANA timezone at a given instant (DST aware). */
export function timeZoneOffsetMs(timeZone:string,date:Date):number{
 const dtf=new Intl.DateTimeFormat('en-US',{timeZone,hour12:false,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit'});
 const parts:Record<string,string>={};
 for(const p of dtf.formatToParts(date))parts[p.type]=p.value;
 const asUTC=Date.UTC(Number(parts.year),Number(parts.month)-1,Number(parts.day),Number(parts.hour)%24,Number(parts.minute),Number(parts.second));
 return asUTC-date.getTime();
}

/** First instant (UTC) of the calendar month containing `now` in the given timezone. */
export function monthStartIn(timeZone:string,now:Date=new Date()):Date{
 const dtf=new Intl.DateTimeFormat('en-CA',{timeZone,year:'numeric',month:'2-digit'});
 const parts:Record<string,string>={};
 for(const p of dtf.formatToParts(now))parts[p.type]=p.value;
 const guess=Date.UTC(Number(parts.year),Number(parts.month)-1,1);
 return new Date(guess-timeZoneOffsetMs(timeZone,new Date(guess)));
}

/** Normalized monthly recurring contribution of one subscription line (documented convention). */
export function monthlyRecurring(frequency:string,unitPrice:number,quantity:number):number{
 const per=unitPrice*quantity;
 switch(frequency){
  case 'YEARLY':return money(per/12);
  case 'WEEKLY':return money(per*52/12);
  case 'DAILY':return money(per*365/12);
  default:return money(per);
 }
}
