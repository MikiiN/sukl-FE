interface SearchBarProps {
  value: string;
  onChange: (newValue: string) => void;
}

export const SearchBar = ({ value, onChange }: SearchBarProps) => {
  return (
    <div className="search-form">
      <input 
        type="text" 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Začněte psát název léku (např. Ibalgin)..."
        className="search-input"
      />
    </div>
  );
}