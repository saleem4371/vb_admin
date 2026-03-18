import Input from "./Input";
import Select from "./Select";

export default function VendorStep({ form, setForm }) {
  const states = [
    "Karnataka",
    "Tamil Nadu",
    "Kerala",
    "Maharashtra",
    "Telangana",
    "Andhra Pradesh",
  ];

  const designations = [
    "Owner",
    "Manager",
    "Sales Manager",
    "Director",
    "Admin",
  ];

  const handleChange = (k, v) => {
    setForm((prev) => ({ ...prev, [k]: v }));
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-6">Vendor Details</h3>

      <div className="grid grid-cols-2 gap-6">
        <Input
          label="Company Name"
          value={form.company}
          onChange={(v) => handleChange("company", v)}
          maxLength={120}
          placeholder="Enter Compnay name"
        />

         

        <Input
          label="Company Email"
          value={form.email}
          onChange={(v) => handleChange("email", v)}
           maxLength={120}
          placeholder="Enter Email address"
        />

        <Input
          label="Company Phone"
          value={form.phone}
          onChange={(v) => handleChange("phone", v)}
           maxLength={10}
          placeholder="Enter Phone Number"
        />

        <Select
          label="State"
          value={form.state}
          options={states}
          onChange={(v) => handleChange("state", v)}
        />

        <Input
          label="First Name"
          value={form.first}
          onChange={(v) => handleChange("first", v)}
           maxLength={120}
          placeholder="Enter First Name"
        />

        <Input
          label="Last Name"
          value={form.last}
          onChange={(v) => handleChange("last", v)}
             maxLength={120}
          placeholder="Enter Last Name"
        />

        <Select
          label="Designation"
          value={form.designation}
          options={designations}
          onChange={(v) => handleChange("designation", v)}
        />
      </div>
    </div>
  );
}
