const FormField = ({
    id,
    label,
    value,
    onChange,
    type = "text",
    rows = 3,
  }) => {
    return (
      <div className="mb-4">
        <label htmlFor={id} className="block mb-1 text-sm font-medium text-gray-700">
          {label}
        </label>
        {type === "textarea" ? (
          <textarea
            id={id}
            value={value}
            onChange={onChange}
            rows={rows}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        ) : (
          <input
            type={type}
            id={id}
            value={value}
            onChange={onChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        )}
      </div>
    );
  };
  
  export default FormField;