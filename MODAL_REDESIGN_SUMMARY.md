# Modal Redesign Summary

## Completed Changes

All 5 KPI modals have been updated with EPIC EHR aesthetic:

### 1. TheatreOpsModal ✅
- Two-panel layout with separate headers
- Left sidebar: "Summary Stats" header + stats cards
- Right panel: "Theatre Operations Summary" header + filters + content
- Full-screen on mobile, modal on desktop

### 2. StaffDutyModal ✅
- Two-panel layout with separate headers
- Left sidebar: "Staffing Summary" header + stats cards
- Right panel: "Staff on Duty - Overview" header + filters + content
- Full-screen on mobile, modal on desktop

### 3. TurnoverTimeModal ⚠️ NEEDS FIX
- Currently has single header spanning both panels
- NEEDS: Left sidebar header + Right panel header separately

### 4. EfficiencyScoreModal ⚠️ NEEDS FIX
- Currently has single header spanning both panels
- NEEDS: Left sidebar header + Right panel header separately

### 5. StaffReliefModal ✅
- Already has proper two-panel layout
- Left panel: "Relief Requests" with header
- Right panel: Dynamic headers based on selection

## Pattern to Apply

```tsx
// Outer container
<div className="fixed inset-0 z-50 bg-white lg:bg-black lg:bg-opacity-40 lg:backdrop-blur-sm flex items-center justify-center lg:p-4">
  <div className="bg-white lg:rounded-2xl lg:shadow-2xl w-full lg:max-w-7xl h-full lg:h-[90vh] overflow-hidden flex">

    {/* Left Sidebar */}
    <div className="w-48 bg-gray-50 border-r border-gray-200 flex-shrink-0 flex flex-col overflow-hidden">
      {/* Left Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white px-3 py-4 flex-shrink-0">
        <h3 className="text-sm font-bold">Title</h3>
        <p className="text-blue-100 text-[10px] mt-1">Subtitle</p>
      </div>
      {/* Left Content */}
      <div className="p-3 flex-1 overflow-y-auto">
        {/* Stats cards here */}
      </div>
    </div>

    {/* Right Panel */}
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Right Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white px-6 py-5 flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="text-lg font-bold">Main Title</h2>
          <p className="text-blue-100 text-xs mt-1">Subtitle</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-blue-800 rounded-lg transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
      {/* Right Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Main content here */}
      </div>
    </div>

  </div>
</div>
```
