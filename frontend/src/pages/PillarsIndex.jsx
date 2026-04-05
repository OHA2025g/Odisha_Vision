import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllPillarSummaries } from "@/data/pillarContent";

const PillarsIndex = () => {
  const summaries = getAllPillarSummaries();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-[#1E3A8A]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </div>
        <div className="mb-10 max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Six strategic pillars</h1>
          <p className="mt-3 text-base leading-relaxed text-slate-600">
            Independent pages for each foundation of <strong>Odisha Vision 2036 &amp; 2047</strong> - with
            tabs for overview, sectors, features and goals, themes, strategic initiatives, and insights.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {summaries.map((p) => (
            <Link key={p.slug} to={`/pillars/${p.slug}`} className="group block">
              <Card className="h-full border-slate-200 shadow-sm transition-all hover:border-[#F26522]/40 hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block h-3 w-3 shrink-0 rounded-full"
                        style={{ backgroundColor: p.color }}
                        aria-hidden
                      />
                      <CardTitle className="text-lg text-slate-900 group-hover:text-[#1E3A8A]">
                        {p.title}
                      </CardTitle>
                    </div>
                    <ChevronRight className="h-5 w-5 shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-[#F26522]" />
                  </div>
                  <CardDescription className="text-xs font-medium text-slate-500">
                    Document: {p.documentPillarName}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-3 text-sm leading-relaxed text-slate-600">{p.overviewPreview}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default PillarsIndex;
