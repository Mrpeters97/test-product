export default function FormRow({ label, required, children }) {
  return (
    <div className="flex items-center gap-4 w-full">
      <label className="flex w-[200px] h-10 items-center text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex-1 flex items-center gap-[var(--Gap-2,8px)]">
        {children}
      </div>
    </div>
  );
}