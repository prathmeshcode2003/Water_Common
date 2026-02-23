import { selectPropertyAction } from "@/app/[locale]/water-tax/actions";
import type { WaterConnectionSummary } from "@/types/water-tax.types";
import { Card } from "@/components/common/Card";

export function PropertySelectScreen({
  connections,
}: {
  connections: WaterConnectionSummary[];
}) {
  return (
    <section className="min-h-[70vh] bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-2xl font-semibold text-gray-900">Select Property</div>
        <div className="text-gray-600 mt-1">
          Multiple properties are linked. Please choose one to continue.
        </div>

        <div className="mt-6 grid md:grid-cols-2 gap-4">
          {connections.map((c) => (
            <Card key={c.connectionId} className="border border-gray-200 bg-white">
              <div className="font-medium text-gray-900">{c.ownerName}</div>
              <div className="text-sm text-gray-600 mt-1">{c.addressLine}</div>

              <div className="mt-3 text-sm text-gray-700">
                <div>Consumer No: <span className="font-medium">{c.consumerNo}</span></div>
                <div>Property No: <span className="font-medium">{c.propertyNo}</span></div>
              </div>

              <form action={selectPropertyAction} className="mt-4">
                <input type="hidden" name="connectionId" value={c.connectionId} />
                <button
                  type="submit"
                  className="w-full px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  Continue
                </button>
              </form>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
