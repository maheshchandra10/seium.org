import badgeTypes from "@data/badge_types.json";

export default function BadgeFilter({ onChange }) {
  return (
    <div>
      <select
        id="location"
        name="location"
        className="mt-1 block w-full rounded-full border-2 border-quinary bg-white py-2 pl-3 pr-10 text-black ring-quinary focus:border-quinary"
        defaultValue="All"
        onChange={(e) => {
          const badge = badgeTypes.find(
            (type) => type.name == e.currentTarget.value,
          );
          onChange(badge ? badge.id : null);
        }}
      >
        <option key={null}>All</option>
        {badgeTypes.map((type) => (
          <option key={type.id}>{type.name}</option>
        ))}
      </select>
    </div>
  );
}
