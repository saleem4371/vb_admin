import GooglePlaceInput from "@/components/GooglePlaceInput";
import Input from "./Input";

export default function ParentVenueStep({ venue, setVenue }) {
  const handleVenue = (k, v) => {
    setVenue((prev) => ({ ...prev, [k]: v }));
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-6">Parent Venue</h3>

      <div className="grid grid-cols-2 gap-6">
        <Input
          label="Venue Name"
          value={venue.name}
          onChange={(v) => handleVenue("name", v)}
            maxLength={120}
          placeholder="Enter First Name"
        />

        <div className="col-span-1">
          <GooglePlaceInput setVenue={(data) => setVenue(data)} />
        </div>

        <Input
          label="City"
          value={venue.city}
          onChange={(v) => handleVenue("city", v)}
            maxLength={120}
          placeholder="Enter First Name"
        />

        <Input
          label="Address"
          value={venue.address}
          onChange={(v) => handleVenue("address", v)}
            maxLength={500}
          placeholder="Enter First Name"
        />
      </div>
    </div>
  );
}
