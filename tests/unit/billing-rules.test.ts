import {test} from 'node:test';
import assert from 'node:assert/strict';
import {calculateTax,money,nextBillingDate} from '../../server/src/billing/rules.js';

test('money rounds to two decimal places',()=>{
 assert.equal(money(0.1+0.2),0.3);
 assert.equal(money(12.345),12.35);
});

test('monthly dates preserve the original end-of-month anchor after clamping',()=>{
 const october=new Date(Date.UTC(2026,9,31));
 const november=nextBillingDate(october,'MONTHLY',31);
 const december=nextBillingDate(november,'MONTHLY',31);
 assert.equal(november.toISOString().slice(0,10),'2026-11-30');
 assert.equal(december.toISOString().slice(0,10),'2026-12-31');
});

test('yearly billing clamps leap day without losing annual cadence',()=>{
 const next=nextBillingDate(new Date(Date.UTC(2024,1,29)),'YEARLY',29);
 assert.equal(next.toISOString().slice(0,10),'2025-02-28');
});

test('daily and weekly periods advance by calendar days',()=>{
 const date=new Date(Date.UTC(2026,9,31));
 assert.equal(nextBillingDate(date,'DAILY',31).toISOString().slice(0,10),'2026-11-01');
 assert.equal(nextBillingDate(date,'WEEKLY',31).toISOString().slice(0,10),'2026-11-07');
});

test('tax is calculated and rounded by rule in integer cents',()=>{
 assert.equal(calculateTax(100, [18]),18);
 assert.equal(calculateTax(0.05,[10,10]),0.02);
});
