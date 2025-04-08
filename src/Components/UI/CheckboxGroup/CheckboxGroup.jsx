const CheckboxGroup = ({
  label,
  options,
  namePrefix,
  selectedValue,
  onChange,
}) => {
  return (
    <div className="checkbox-group flex items-center gap-4 my-6">
      <h6 className="font-bold text-base text-gray-dark">{label}</h6>
      <div className="inputs flex flex-wrap gap-4">
        {options.map((option) => (

          <div key={option.id} className="flex items-center gap-1">
            <input
              type="radio"
              id={`${namePrefix}-${option.id}`} // Unique ID for accessibility
              name={namePrefix} // Name should not include option id for radio buttons
              value={option.id}
              checked={selectedValue === option.id}
              onChange={(e) => onChange(e.target.value)}
              className="appearance-none w-3 h-3 border border-gray rounded-sm cursor-pointer checked:bg-purple checked:border-purple duration-500"
            />
            <label
              htmlFor={`${namePrefix}-${option.id}`}
              className="font-medium text-base"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckboxGroup;
