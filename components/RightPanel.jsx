export default function RightPanel() {
  return (
    <div className="space-y-8">

      {/* Welcome Card */}
      <div className="rounded-2xl p-6 text-white shadow-lg bg-gradient-to-br from-indigo-700 to-indigo-900">
        <h3 className="text-lg font-semibold">Hey John!</h3>
        <p className="text-sm mt-2 opacity-80">
          Wealth creation is an evolutionarily recent positive-sum game.
        </p>

        <button className="mt-5 px-5 py-2 rounded-xl bg-white text-indigo-700 text-sm font-medium">
          Read More
        </button>
      </div>

      {/* Categories */}
      <div className="soft-card p-6">
        <h3 className="font-semibold mb-6">Categories</h3>

        <div className="space-y-5 text-sm">
          <div className="flex justify-between">
            <span>Devices</span>
            <span className="text-gray-400">250 in stock</span>
          </div>

          <div className="flex justify-between">
            <span>Tickets</span>
            <span className="text-gray-400">15 open</span>
          </div>

          <div className="flex justify-between">
            <span>Error logs</span>
            <span className="text-gray-400">40 closed</span>
          </div>
        </div>
      </div>

    </div>
  );
}
