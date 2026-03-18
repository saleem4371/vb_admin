export default function Input({ label, value, onChange ,maxLength ,error , placeholder}) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>

      <input
        value={value} 
        placeholder={placeholder}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full border  border-gray-200 px-3 py-2 rounded mt-1
        ${error ? "border-red-500" : value ? "border-green-500" : "border-gray-200"}`}
      />
        {maxLength && (
        <p className="text-xs text-gray-400 text-right">
          {value.length}/{maxLength}
        </p>
      )}
    </div>
  );
}
