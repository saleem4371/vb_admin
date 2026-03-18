"use client";

export default function EditChildVenueModal({ venue, close }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-[500px] p-6 shadow-xl">
        <h2 className="text-lg font-semibold mb-4">
          Edit Child Venue
        </h2>

        <div className="space-y-4">

          {/* Venue Name */}
          <div>
            <label className="text-sm font-medium">Venue Name</label>
            <input
              defaultValue={venue.name}
              className="w-full border border-gray-200
 rounded-lg p-2 mt-1"
            />
          </div>

          {/* Capacity */}
          <div>
            <label className="text-sm font-medium">Guest Capacity</label>
            <input
              defaultValue={venue.capacity}
              className="w-full border border-gray-200
 rounded-lg p-2 mt-1"
            />
          </div>

          {/* Renovated Year */}
          <div>
            <label className="text-sm font-medium">Renovated Year</label>
            <input
              defaultValue={venue.renovated}
              className="w-full border border-gray-200
 rounded-lg p-2 mt-1"
            />
          </div>

          {/* Shifts */}
          <div className="grid grid-cols-3 gap-3">

            <div>
              <label className="text-sm">Morning Price</label>
              <input
                defaultValue={venue.shifts.morning}
                className="w-full border border-gray-200
 rounded-lg p-2 mt-1"
              />
            </div>

            <div>
              <label className="text-sm">Afternoon Price</label>
              <input
                defaultValue={venue.shifts.afternoon}
                className="w-full border border-gray-200
 rounded-lg p-2 mt-1"
              />
            </div>

            <div>
              <label className="text-sm">Evening Price</label>
              <input
                defaultValue={venue.shifts.evening}
                className="w-full border border-gray-200
 rounded-lg p-2 mt-1"
              />
            </div>

          </div>

        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={close}
            className="px-4 py-2 border border-gray-200
 rounded-lg"
          >
            Cancel
          </button>

          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
