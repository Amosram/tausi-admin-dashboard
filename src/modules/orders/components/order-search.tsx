import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
const MIN_SEARCH_LENGTH = 2;

const getFieldRelevanceScore = (
  fieldValue: string,
  searchTerm: string
): number => {
  const value = String(fieldValue).toLowerCase();
  const term = searchTerm.toLowerCase();

  if (value === term) return 1; // Exact match
  if (value.startsWith(term)) return 0.8; // Starts with search term
  if (value.includes(term)) return 0.6; // Contains search term

  // Partial word matches
  const words = value.split(/\s+/);
  const hasWordMatch = words.some((word) => word.startsWith(term));
  if (hasWordMatch) return 0.4;

  return 0;
};

const getRecordRelevanceScore = (record: any, searchTerm: string): number => {
  let maxScore = 0;

  Object.entries(record).forEach(([key, value]) => {
    if (key !== "select" && key !== "actions" && value) {
      const score = getFieldRelevanceScore(String(value), searchTerm);
      maxScore = Math.max(maxScore, score);
    }
  });

  return maxScore;
};

export function OrdersTableSearch({
  data,
  onSearch,
}: {
  data: any[];
  onSearch: (filteredData: any[]) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch] = useDebounce(searchTerm, 300);
  const searchData = (term: string) => {
    if (!term || term.length < MIN_SEARCH_LENGTH) {
      onSearch(data);
      return;
    }

    const scoredData = data.map((record) => ({
      record,
      score: getRecordRelevanceScore(record, term),
    }));

    const filteredAndSorted = scoredData
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.record);

    onSearch(filteredAndSorted.length > 0 ? filteredAndSorted : []);
  };

  useEffect(() => {
    searchData(debouncedSearch);
  }, [debouncedSearch, data]);

  return (
    <div className="relative w-full">
      <div className="relative w-full">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search orders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8 pr-8 border-black/40 border focus:border-none bg-secondary md:rounded-3xl"
        />
      </div>
    </div>
  );
}
