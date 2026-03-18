export default function ActivityTable({ data }) {
  return (
    <div className="bg-white shadow rounded-xl p-4">
      <h3 className="font-semibold mb-4">Activity Logs</h3>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500">
            <th>User</th>
            <th>Action</th>
            <th>Time</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item, i) => (
            <tr key={i} className="border-t">
              <td>{item.user}</td>
              <td>{item.action}</td>
              <td>
                {new Date(item.time).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
