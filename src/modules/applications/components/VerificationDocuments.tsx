import { VerifiedBeauticians } from "@/models";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface VerificationDocumentsProps {
  verificationDocuments: VerifiedBeauticians;
}

const VerificationDocuments = ({ verificationDocuments }: VerificationDocumentsProps) => {
  const { verificationData } = verificationDocuments;

  // Check if verification documents exist
  const hasDocuments = verificationData?.verificationDocuments?.length > 0;

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Conditional Rendering */}
      {hasDocuments ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {verificationData.verificationDocuments.map((document, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>Resume</CardTitle>
                <CardDescription>Professional experience and qualifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center items-center">
                  <img
                    src="/pdf.png"
                    alt="PDF Icon"
                    width={64}
                    height={64}
                    className="cursor-pointer"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        // No Documents UI
        <Card className="flex flex-col items-center justify-center space-y-4 p-6 mt-6 rounded-lg">
          <img
          src="/no-data.png"
          alt="No Documents Icon"
          className="h-40 w-40 object-cover"
          />
          <p className="text-lg font-semibold text-gray-600">No Verification Documents Attached</p>
        </Card>
      )}
    </div>
  );
};

export default VerificationDocuments;
