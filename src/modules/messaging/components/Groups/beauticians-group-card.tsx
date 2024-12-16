import React, { useState, useMemo, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TausiUser } from "@/models/user";
import { FiMessageSquare, FiSearch } from "react-icons/fi";
import { debounce } from "lodash";

interface BeauticiansGroupCardProps {
  data: TausiUser[];
  isLoading: boolean;
  error: any;
}

export const BeauticiansGroupCard: React.FC<BeauticiansGroupCardProps> = ({
  data: beauticians,
  isLoading,
  error,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const debouncedSearch = useCallback(
    debounce((term: string) => {
      setSearchTerm(term);
    }, 500),
    []
  );

  const filteredBeauticians = useMemo(() => {
    if (!searchTerm) return beauticians;

    return beauticians.filter((beautician) =>
      beautician.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [beauticians, searchTerm]);

  const handleSingleMessage = () => {
    console.log("Action");
  };

  if (isLoading)
    return (
      <Card>
        <CardContent>Loading...</CardContent>
      </Card>
    );
  if (error)
    return (
      <Card>
        <CardContent>Error loading professionals</CardContent>
      </Card>
    );

  return (
    <Card className="overflow-y-scroll">
      <CardHeader>
        <CardTitle>Professionals Group</CardTitle>
        <CardDescription>
          <div className="px-4 py-2">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search professionals..."
                className="pl-10 w-full text-black"
                onChange={(e) => debouncedSearch(e.target.value)}
              />
              <FiSearch
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {filteredBeauticians.map((beautician, index) => (
          <div
            key={index}
            className={`flex py-4 px-2 items-center justify-between ${
              index !== 0 ? "border-t border-gray-300 " : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 relative">
                  <div className="absolute inset-0 bg-white rounded-full" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-yellow-300 rounded-full" />
                  <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full" />
                </div>
              </div>
              <div className="flex flex-col gap-1 text-sm">
                <h1>{beautician.name}</h1>
                <p>________ completed orders</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <button
                className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm"
                onClick={() => handleSingleMessage()}
              >
                <FiMessageSquare size={18} />
                <span className="font-semibold">Text</span>
              </button>
            </div>
          </div>
        ))}

        {filteredBeauticians.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            No professionals found
          </div>
        )}
      </CardContent>
      <CardFooter>
        <p>
          Showing {filteredBeauticians.length} of {beauticians.length}{" "}
          professionals
        </p>
      </CardFooter>
    </Card>
  );
};
