# 🧮 Smart Excel Merge Guide

**Tired of manually checking 50+ rows?** These smart merge features eliminate the manual labor!

## 🎯 The Problem You Had

Before:
1. Collect strings from GitHub PR ✅
2. Open your Excel file
3. **Check each key: "Does this exist?"** ⏰ (5-10 minutes)
4. **If exists → find the row → update value** ⏰
5. **If new → add to end** ⏰
6. **Repeat 50+ times** 😫

**Total time:** 30-60 minutes per PR

---

## ✨ The Solution: 3 Smart Merge Options

### Option 1: 📥 Download CSV + Formula (RECOMMENDED)
**Best for:** Recurring updates, large datasets  
**Time:** 2 minutes  
**Difficulty:** Easy

#### How It Works:
1. Click **"Download CSV"** → saves `github-strings-2026-08-10.csv`
2. Open your Excel file
3. Import CSV as new sheet (Data → From Text/CSV)
4. Name the sheet **"NewData"**
5. In your main sheet, add a helper column (e.g., Column C)
6. Click **"Merge Helper"** button in extension
7. Copy the formula it generates
8. Paste in C2, drag down to all rows
9. Copy column C → Paste Values to column B
10. Delete helper column C and NewData sheet
11. **Done!** ✅

#### Example Formula (XLOOKUP):
```excel
=IFERROR(XLOOKUP(A2,NewData!A:A,NewData!B:B),B2)
```

**What it does:**
- Looks up Key in A2
- Searches in NewData sheet column A
- Returns matching value from NewData column B
- If not found, keeps your existing value in B2

**Result:** All modified values auto-updated, you just add the new rows at the end!

---

### Option 2: 📋 Copy as Markdown
**Best for:** Quick visual review, documentation  
**Time:** 30 seconds  
**Difficulty:** Very Easy

#### How It Works:
1. Click **"Copy as Markdown"**
2. Paste into Excel, Notion, Google Docs, or Slack
3. Visual review with formatting
4. Manually merge if needed

#### Output Example:
```markdown
| Key | Value | Status |
|-----|-------|--------|
| app_title | My App | Added |
| welcome_msg | ~~Hello~~ → Welcome | Modified |
```

---

## 📊 Detailed Step-by-Step: CSV + Formula Method

### Step 1: Download the Data
1. Go to GitHub PR
2. Click extension → **"Collect Strings"**
3. Click **"📥 Download CSV"**
4. File saves as `github-strings-YYYY-MM-DD.csv`

### Step 2: Import to Excel
1. Open your localization Excel file
2. Go to **Data** tab → **Get Data** → **From File** → **From Text/CSV**
3. Select the downloaded CSV
4. Click **Load** → Choose **"New worksheet"**
5. Rename the new sheet to **"NewData"** (important!)

### Step 3: Create Helper Formula
1. Go back to your main sheet (e.g., "Localization Strings")
2. Click on **Column C** (or any empty column next to Value)
3. In cell **C1**, type: `Helper`
4. In cell **C2**, paste one of these formulas:

**For Excel 365/2021:**
```excel
=IFERROR(XLOOKUP(A2,NewData!A:A,NewData!B:B),B2)
```

**For Excel 2016/2019:**
```excel
=IFERROR(VLOOKUP(A2,NewData!A:B,2,0),B2)
```

**For Maximum Compatibility:**
```excel
=IFERROR(INDEX(NewData!B:B,MATCH(A2,NewData!A:A,0)),B2)
```

5. Press **Enter**
6. Double-click the fill handle (small square at bottom-right of cell) to auto-fill down

### Step 4: Copy Values
1. Select entire column C (with formulas)
2. **Ctrl+C** (copy)
3. Select column B (your Value column)
4. Right-click → **Paste Special** → **Values**
5. Now column B has updated values!

### Step 5: Add New Rows
1. Look at NewData sheet
2. Find rows with "ADD NEW ROW" in column D
3. Copy those rows
4. Paste at the end of your main sheet

### Step 6: Cleanup
1. Delete helper column C
2. Delete NewData sheet
3. Save your file
4. **Done!** ✅

---

## 🧮 Formula Breakdown

### What Does This Do?
```excel
=IFERROR(XLOOKUP(A2,NewData!A:A,NewData!B:B),B2)
```

**Step by step:**
1. `A2` - The key in current row
2. `NewData!A:A` - Look in NewData sheet, column A (all keys)
3. `NewData!B:B` - Return value from column B (new values)
4. `,B2` - If not found, keep existing value
5. `IFERROR(...)` - Handle errors gracefully

**Example:**
- Your sheet: `app_title` → `My App`
- NewData: `app_title` → `My Awesome App`
- Formula result: `My Awesome App` ✅

**Example (key not in NewData):**
- Your sheet: `old_key` → `Old Value`
- NewData: (doesn't have `old_key`)
- Formula result: `Old Value` ✅ (unchanged)

---

## 💡 Pro Tips

### Tip 1: Color Code Changes
After running formulas, compare:
1. Select column B and C
2. **Home** → **Conditional Formatting** → **Highlight Cells Rules** → **Duplicate Values**
3. Different values = modified strings (highlighted)

### Tip 2: Filter by Status
In CSV, there's a Status column:
- **Added** = new keys (add to end)
- **Modified** = changed values (auto-updated by formula)
- **Deleted** = removed keys (review before deleting)

### Tip 3: Keep NewData Sheet Temporarily
Don't delete NewData sheet immediately:
- Review changes first
- Check formula results
- Verify counts match

### Tip 4: Use Named Range (Advanced)
Instead of `NewData!A:A`, create named range:
1. Select NewData!A:B
2. **Formulas** → **Define Name** → `PRStrings`
3. Formula becomes: `=IFERROR(XLOOKUP(A2,PRStrings,2),B2)`

---

## 🎬 Quick Demo

### Before (Manual Way):
```
GitHub PR shows: app_title changed
Your Excel: Row 47 has app_title
Action: Scroll to row 47, update value
Time: 30 seconds × 50 = 25 minutes
```

### After (Smart Merge):
```
1. Download CSV: 5 seconds
2. Import to Excel: 15 seconds
3. Add formula: 10 seconds
4. Drag down: 2 seconds
5. Paste values: 5 seconds
6. Add new rows: 30 seconds
Total: ~70 seconds!
```

**Time saved: 23+ minutes per PR** ⏰→💰

---

## 🔍 Troubleshooting

### Formula shows #REF! error
- **Cause:** NewData sheet not found or renamed
- **Fix:** Make sure sheet is named exactly "NewData"

### Formula shows #N/A error
- **Cause:** Key not found in NewData
- **Fix:** This is normal! Formula will keep existing value (B2)

### XLOOKUP not recognized
- **Cause:** Older Excel version
- **Fix:** Use VLOOKUP or INDEX-MATCH formula instead

### CSV doesn't import properly
- **Cause:** Encoding or delimiter issue
- **Fix:** Use Data → From Text/CSV → choose UTF-8 encoding

### Values don't update
- **Cause:** Pasted formula as text
- **Fix:** Make sure to paste in C2, press Enter, then drag down

---

## 📈 Summary Comparison

| Method | Time | Effort | Automation | Setup |
|--------|------|--------|------------|-------|
| **Manual Copy/Paste** | 30+ min | High | 0% | None |
| **Copy as Markdown** | 15-20 min | Medium | 20% | None |
| **CSV + Formula** | 2-3 min | Low | 80% | None |

---

## 🚀 Next Steps

1. **Try it now:** Go to a GitHub PR, collect strings, download CSV
2. **Practice:** Do it once slowly to learn the flow
3. **Save formula:** Keep it in a text file for next time
4. **Celebrate:** You just automated 25+ minutes of work! 🎉

---

## 📚 Additional Resources

### Excel Formula Cheat Sheet:
- [XLOOKUP Documentation](https://support.microsoft.com/en-us/office/xlookup-function-b7fd680e-6d10-43e6-84f9-88eae8bf5929)
- [VLOOKUP Guide](https://support.microsoft.com/en-us/office/vlookup-function-0bbc8083-26fe-4963-8ab8-93a18ad188a1)
- [INDEX-MATCH Tutorial](https://support.microsoft.com/en-us/office/index-function-a5dcf0dd-996d-40a4-a822-b56b061328bd)

### Power Query Alternative:
If you use Power Query (Get & Transform):
1. Load both sheets as tables
2. Merge queries on Key column
3. Update values automatically
4. Refresh anytime

---

**Made with** ❤️ **to eliminate Excel drudgery**

Questions? Check the console logs or open an issue!
