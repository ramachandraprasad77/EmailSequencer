const DelayFields = ({ delay, delayUnit, onChange, canDelete, onDelete }) => (
    <>
      <label className="block mb-1 text-sm font-medium text-gray-700">Wait for</label>
      <div className="flex space-x-2 mb-3">
        <input
          type="number"
          value={delay}
          onChange={(e) => onChange("delay", e.target.value)}
          className="w-1/2 border border-gray-300 rounded-md p-2"
          min={1}
        />
        <select
          value={delayUnit}
          onChange={(e) => onChange("delayUnit", e.target.value)}
          className="w-1/2 border border-gray-300 rounded-md p-2"
        >
          {["minutes", "hours", "days", "weeks"].map((unit) => (
            <option key={unit} value={unit}>{unit}</option>
          ))}
        </select>
      </div>
      {canDelete && (
        <button onClick={onDelete} className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded text-sm">
          Delete Delay Step
        </button>
      )}
    </>
  );
  export default DelayFields;