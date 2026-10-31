import type {NextFunction,Request,Response} from 'express';

type Bucket={count:number;resetAt:number};

/**
 * Fixed-window in-memory rate limiter. Suitable for a single-process backend
 * (Render single instance). Buckets are keyed by client IP + route bucket name
 * and are pruned lazily so memory stays bounded.
 */
export function createRateLimiter(bucket:string,max:number,windowMs:number,buckets:Map<string,Bucket>=new Map()){
 return (req:Request,res:Response,next:NextFunction)=>{
  const ip=req.ip||req.socket.remoteAddress||'unknown';
  const key=`${bucket}:${ip}`;
  const now=Date.now();
  const entry=buckets.get(key);
  if(!entry||entry.resetAt<=now){
   if(buckets.size>10000)for(const [k,v] of buckets)if(v.resetAt<=now)buckets.delete(k);
   buckets.set(key,{count:1,resetAt:now+windowMs});
   return next();
  }
  entry.count++;
  if(entry.count>max){
   const retryAfter=Math.max(1,Math.ceil((entry.resetAt-now)/1000));
   res.setHeader('Retry-After',String(retryAfter));
   return res.status(429).json({error:'RATE_LIMITED',retryAfter});
  }
  next();
 };
}
