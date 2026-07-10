#!/usr/bin/env node

console.log('🔍 Resend Domain Verification Check');
console.log('====================================\n');

console.log('📧 Email Domain Configuration:');
console.log('   Domain: gardengrains.co.za');
console.log('   Region: eu-west-1');
console.log('   Tracking Subdomain: reservations.gardengrains.co.za');
console.log('   Custom Return-Path: reservations.gardengrains.co.za');
console.log('   Click Tracking: Enabled');
console.log('   Open Tracking: Enabled\n');

console.log('📋 To set up your domain in Resend:');
console.log('   1. Log in to Resend (https://resend.com)');
console.log('   2. Go to Domains → Add Domain');
console.log('   3. Enter: gardengrains.co.za');
console.log('   4. Region: eu-west-1');
console.log('   5. Add DNS records provided by Resend');
console.log('   6. Wait for DNS verification (5-10 minutes)');
console.log('   7. Once verified, update .env.local with your API key\n');

console.log('🔑 Environment Variables to add:');
console.log('   RESEND_API_KEY=re_xxxxxxxxxxxxx');
console.log('   NEXT_PUBLIC_EMAIL_DOMAIN=gardengrains.co.za\n');

console.log('📧 Email Addresses:');
console.log('   Sender: reservations@gardengrains.co.za');
console.log('   Recipient: reservations@gardengrains.co.za');
console.log('   Customer Reply-To: customer@email.com\n');

console.log('✅ After setup, test with:');
console.log('   curl -X POST http://localhost:3000/api/send-reservation \\');
console.log('     -H "Content-Type: application/json" \\');
console.log('     -d \'{"name":"Test","email":"test@example.com","phone":"+27123456789","date":"2024-12-25","time":"18:00","guests":2}\'\n');
