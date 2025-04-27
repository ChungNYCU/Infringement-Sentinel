import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
  } from '@/components/ui/card';
  
  export default function ReportCard({ report }: { report: any }) {
    return (
      <div className="max-h-[70vh] overflow-y-auto space-y-8 p-4">
        {/* Arrange two cards per row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {report.top_infringing_products.map((prod: any) => (
            <Card key={prod.product_name} className="shadow-md">
              <CardHeader className="bg-gray-100">
                <CardTitle className="text-gray-900">
                  {prod.product_name}
                </CardTitle>
                <p className="text-sm font-semibold text-gray-600">
                  Likelihood: <span className="text-gray-700">{prod.infringement_likelihood}</span>
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">{prod.explanation}</p>
  
                <div>
                  <h4 className="font-medium text-gray-800">Relevant Claims:</h4>
                  <ul className="list-disc list-inside text-gray-600 ml-4">
                    {prod.relevant_claims.map((cl: any) => (
                      <li key={cl.num} className="mb-1">
                        <span className="font-semibold text-gray-800">{cl.num}:</span> {cl.text}
                      </li>
                    ))}
                  </ul>
                </div>
  
                <div>
                  <h4 className="font-medium text-gray-800">Specific Features:</h4>
                  <ul className="flex flex-wrap gap-2 mt-2">
                    {prod.specific_features.map((f: string) => (
                      <li key={f} className="inline-block bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-sm">
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
  
        {/* Overall risk card spans full width */}
        <Card className="bg-yellow-50">
          <CardContent>
            <h3 className="text-xl font-bold text-gray-800">
              Overall Risk Assessment
            </h3>
            <p className="text-gray-700 mt-2">
              {report.overall_risk_assessment}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }