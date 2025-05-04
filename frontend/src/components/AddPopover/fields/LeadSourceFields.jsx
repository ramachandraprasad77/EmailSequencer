const LeadSourceFields = ({ leadSource, onChange, canAddEmail, onAddNode }) => (
    <>
      <label className="block mb-1 text-sm font-medium text-gray-700">Lead Source Type</label>
      <select
        value={leadSource}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded-md p-2"
      >
        {["Email", "Phone", "Chat", "Social Media", "Website Form", "Referral"].map((src) => (
          <option key={src} value={src}>{src}</option>
        ))}
      </select>
      {canAddEmail && (
        <button onClick={onAddNode} className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded text-sm">
          Add Email Step
        </button>
      )}
    </>
  );
  export default LeadSourceFields;