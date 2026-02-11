#!/bin/bash

# Check temp email for Property Magic download link

echo "🔍 Checking Property Magic email..."
echo "Temp Email: temp1770641295@10minutemail.com"
echo ""

# Try multiple temp email services
echo "📧 Attempt 1: Checking 10minutemail..."

# 10minutemail doesn't have a simple API, so we'll provide manual instructions
echo "❓ Need to check manually at: https://10minutemail.com"
echo ""

echo "📧 Attempt 2: Checking guerrillamail..."
RESPONSE=$(curl -s "https://www.guerrillamail.com/ajax.php?get_email&email=temp1770641295@10minutemail.com")

if echo "$RESPONSE" | grep -qi "property\|magic\|rick"; then
    echo "✅ Found Property Magic email!"
    echo "$RESPONSE" | head -500
else
    echo "❌ No Property Magic email yet"
fi

echo ""
echo "📋 MANUAL CHECK REQUIRED:"
echo ""
echo "Step 1: Open https://10minutemail.com"
echo "Step 2: Email address: temp1770641295@10minutemail.com"
echo "Step 3: Look for email from 'Property Magic' or 'Rick Otton'"
echo "Step 4: Click download link"
echo "Step 5: Save PDF"
echo ""

echo "⏰ Email typically arrives 1-5 minutes after form submission"
echo "📅 Form was submitted at approximately: $(date)"
