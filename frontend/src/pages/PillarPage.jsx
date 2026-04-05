import React from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Users,
  MapPin,
  Calendar,
  Zap,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Bookmark,
  Award,
  Star,
  TrendingUp,
  Target,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getPillarContent, PILLAR_ORDER } from "@/data/pillarContent";

const sectorTabIcons = {
  barChart: BarChart3,
  checkCircle: CheckCircle2,
  alertCircle: AlertCircle,
  users: Users,
};

/** Equal-width cells: inactive grey; active white pill + border + bold */
const pillarTabTriggerClass =
  "flex min-h-10 min-w-0 flex-1 basis-0 items-center justify-center rounded-lg border border-transparent bg-transparent px-1 py-1.5 text-center text-[10px] font-normal leading-tight text-slate-500 shadow-none transition-colors sm:min-h-0 sm:px-1.5 sm:py-2 sm:text-xs md:px-2 md:text-sm " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 focus-visible:ring-offset-2 " +
  "data-[state=active]:border-slate-900 data-[state=active]:bg-white data-[state=active]:font-bold " +
  "data-[state=active]:text-slate-900 data-[state=active]:shadow-sm data-[state=inactive]:hover:text-slate-700";

const PillarPage = () => {
  const { slug } = useParams();
  const pillar = slug ? getPillarContent(slug) : null;

  if (!slug || !pillar) {
    return <Navigate to="/pillars" replace />;
  }

  const idx = PILLAR_ORDER.indexOf(slug);
  const ip = pillar.insightsPanel;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <main className="mx-auto max-w-6xl px-3 py-5 sm:px-5 sm:py-6 lg:px-6">
        <div className="mb-2">
          <Link
            to="/pillars"
            className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-[#1E3A8A] sm:text-sm"
          >
            <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            All pillars
          </Link>
        </div>
        <div className="mb-5 sm:mb-6">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: pillar.color }}
              aria-hidden
            />
            <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 sm:text-xs">
              Strategic pillar {idx + 1} of {PILLAR_ORDER.length}
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{pillar.title}</h1>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <Tabs defaultValue="overview" className="w-full">
            <div className="rounded-t-xl border-b border-slate-200/80 bg-slate-100">
              <div className="px-1.5 py-1.5 sm:px-2 sm:py-2">
                <TabsList className="flex h-auto w-full flex-nowrap items-stretch gap-0.5 bg-transparent p-0 sm:gap-1">
                  <TabsTrigger value="overview" className={pillarTabTriggerClass}>
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="insights" className={pillarTabTriggerClass}>
                    Insights
                  </TabsTrigger>
                  <TabsTrigger value="sectors" className={pillarTabTriggerClass}>
                    Sector
                  </TabsTrigger>
                  <TabsTrigger value="features" className={pillarTabTriggerClass}>
                    <span className="px-0.5">Features / Goal</span>
                  </TabsTrigger>
                  <TabsTrigger value="theme" className={pillarTabTriggerClass}>
                    Theme
                  </TabsTrigger>
                  <TabsTrigger value="initiatives" className={pillarTabTriggerClass}>
                    <span className="px-0.5">Strategic Initiative</span>
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

            <div className="px-3 py-4 sm:px-5 sm:py-5">
          <TabsContent value="overview" className="mt-0 focus-visible:outline-none">
            <section className="space-y-5">
              <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">Program Overview</h2>

              <div>
                <h3 className="mb-1.5 text-base font-semibold text-slate-900 sm:text-lg">Summary</h3>
                <p className="text-sm leading-snug text-slate-600 sm:text-base sm:leading-relaxed">{pillar.overview.summary}</p>
              </div>

              <div>
                <h3 className="mb-2 text-base font-semibold text-slate-900 sm:text-lg">Key Objectives</h3>
                <ul className="space-y-2">
                  {pillar.overview.keyObjectives.map((obj, i) => (
                    <li key={i} className="flex gap-2.5 text-sm leading-snug text-slate-700 sm:leading-relaxed">
                      <span
                        className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm"
                        aria-hidden
                      >
                        <Check className="h-3.5 w-3.5 stroke-[3]" />
                      </span>
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-sky-100/80 bg-[#ebf5ff] p-3.5 sm:p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-sky-600 shadow-sm ring-1 ring-sky-100">
                      <Users className="h-5 w-5" strokeWidth={2} />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 sm:text-base">Target Beneficiaries</h4>
                  </div>
                  <p className="text-xs leading-snug text-slate-600 sm:text-sm sm:leading-relaxed">{pillar.overview.cards.targetBeneficiaries}</p>
                </div>
                <div className="rounded-lg border border-violet-100/80 bg-[#f3e8ff] p-3.5 sm:p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-violet-600 shadow-sm ring-1 ring-violet-100">
                      <MapPin className="h-5 w-5" strokeWidth={2} />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 sm:text-base">Geographic Coverage</h4>
                  </div>
                  <p className="text-xs leading-snug text-slate-600 sm:text-sm sm:leading-relaxed">{pillar.overview.cards.geographicCoverage}</p>
                </div>
                <div className="rounded-lg border border-emerald-100/80 bg-[#f0fdf4] p-3.5 sm:p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-600 shadow-sm ring-1 ring-emerald-100">
                      <Calendar className="h-5 w-5" strokeWidth={2} />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 sm:text-base">Timeline</h4>
                  </div>
                  <p className="text-xs leading-snug text-slate-600 sm:text-sm sm:leading-relaxed">{pillar.overview.cards.timeline}</p>
                </div>
                <div className="rounded-lg border border-amber-100/80 bg-[#fefce8] p-3.5 sm:p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-amber-600 shadow-sm ring-1 ring-amber-100">
                      <Zap className="h-5 w-5" strokeWidth={2} />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 sm:text-base">Status</h4>
                  </div>
                  <p className="text-xs font-medium leading-snug text-slate-700 sm:text-sm sm:leading-relaxed">{pillar.overview.cards.status}</p>
                </div>
              </div>
            </section>
          </TabsContent>

          <TabsContent value="insights" className="mt-0 space-y-5 focus-visible:outline-none">
            {ip ? (
              <>
                  <section>
                    <div className="mb-2 flex items-center gap-1.5">
                      <Zap className="h-4 w-4 shrink-0 text-blue-600 sm:h-5 sm:w-5" aria-hidden />
                      <h2 className="text-base font-bold text-slate-900 sm:text-lg">Key Insights Summary</h2>
                    </div>
                    <div className="rounded-lg border border-blue-200 border-l-4 border-l-blue-600 bg-white p-3.5 shadow-sm sm:p-4">
                      <p className="text-sm leading-snug text-slate-700 sm:leading-relaxed">{ip.summary}</p>
                    </div>
                  </section>

                  <section>
                    <div className="mb-2 flex items-center gap-1.5">
                      <Award className="h-4 w-4 shrink-0 text-emerald-600 sm:h-5 sm:w-5" aria-hidden />
                      <h2 className="text-lg font-bold text-slate-900 sm:text-xl">Key Achievements</h2>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {ip.keyAchievements.map((a) => (
                        <div
                          key={a.title}
                          className="rounded-lg border-2 border-emerald-500/80 bg-white p-3.5 shadow-sm sm:p-4"
                        >
                          <h3 className="mb-1.5 text-sm font-bold text-emerald-700 sm:text-base">{a.title}</h3>
                          <span className="mb-2 inline-block rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800 sm:px-3 sm:text-xs">
                            {a.metricBadge}
                          </span>
                          <p className="mb-3 text-xs leading-snug text-slate-600 sm:mb-3 sm:text-sm sm:leading-relaxed">{a.description}</p>
                          <div className="rounded-lg bg-[#E3F2FD] px-2.5 py-2 sm:px-3 sm:py-2.5">
                            <p className="text-sm leading-relaxed">
                              <span className="font-bold text-[#1565C0]">Recommendation: </span>
                              <span className="text-[#0D47A1]">{a.recommendation}</span>
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <div className="mb-2 flex items-center gap-1.5">
                      <AlertCircle className="h-4 w-4 shrink-0 text-orange-600 sm:h-5 sm:w-5" aria-hidden />
                      <h2 className="text-lg font-bold text-slate-900 sm:text-xl">Areas for Improvement</h2>
                    </div>
                    <div className="space-y-3">
                      {ip.areasForImprovement.map((area) => (
                        <div
                          key={area.title}
                          className="rounded-lg border-2 border-orange-400 bg-white p-3.5 shadow-sm sm:p-4"
                        >
                          <div className="mb-1.5 flex flex-wrap items-start justify-between gap-2">
                            <h3 className="text-base font-bold text-amber-900 sm:text-lg">{area.title}</h3>
                            <span className="rounded-full bg-orange-500 px-3 py-0.5 text-xs font-bold text-white">
                              {area.priority}
                            </span>
                          </div>
                          <span className="mb-2 inline-block rounded-full bg-orange-100 px-2.5 py-0.5 text-[11px] font-semibold text-orange-800 sm:px-3 sm:text-xs">
                            {area.gapMetric}
                          </span>
                          <p className="mb-2 text-xs leading-snug text-slate-700 sm:text-sm sm:leading-relaxed">
                            <span className="font-bold text-slate-800">Challenge: </span>
                            {area.challenge}
                          </p>
                          <div className="mb-2 rounded-lg border-l-4 border-blue-500 bg-sky-50 px-2.5 py-2 sm:px-3 sm:py-2.5">
                            <div className="flex gap-2">
                              <Star className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" aria-hidden />
                              <p className="text-sm leading-relaxed">
                                <span className="font-bold text-[#1565C0]">Recommendation: </span>
                                <span className="text-[#0D47A1]">{area.recommendation}</span>
                              </p>
                            </div>
                          </div>
                          <div className="rounded-lg border-l-4 border-violet-600 bg-violet-50/90 p-2.5 sm:p-3">
                            <div className="mb-1.5 flex items-center gap-1.5">
                              <ArrowRight className="h-3.5 w-3.5 shrink-0 text-violet-700 sm:h-4 sm:w-4" aria-hidden />
                              <span className="text-xs font-bold text-violet-900 sm:text-sm">
                                Next Steps / Action Items:
                              </span>
                            </div>
                            <div className="space-y-1.5">
                              {area.nextSteps.map((step, stepIdx) => (
                                <div
                                  key={stepIdx}
                                  className="flex gap-2 rounded-md bg-white p-2 shadow-sm sm:gap-2.5 sm:p-2.5"
                                >
                                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">
                                    {stepIdx + 1}
                                  </span>
                                  <p className="text-sm leading-relaxed text-violet-950">{step}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-sm sm:p-4">
                    <div className="mb-2 flex items-center gap-1.5">
                      <TrendingUp className="h-4 w-4 shrink-0 text-blue-600 sm:h-5 sm:w-5" aria-hidden />
                      <h2 className="text-base font-bold text-slate-900 sm:text-lg">Key Trends</h2>
                    </div>
                    <div className="space-y-2">
                      {ip.keyTrends.map((t, ti) => (
                        <div key={ti} className="flex gap-2 rounded-md bg-slate-50 p-2.5 sm:gap-3 sm:p-3">
                          {t.direction === "up" ? (
                            <TrendingUp className="h-5 w-5 shrink-0 text-emerald-600" aria-hidden />
                          ) : (
                            <ArrowRight className="h-5 w-5 shrink-0 text-slate-400" aria-hidden />
                          )}
                          <div>
                            <p className="font-bold text-slate-900">{t.headline}</p>
                            <p className="text-sm text-slate-500">{t.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="rounded-lg bg-gradient-to-r from-[#8e2de2] to-[#4a00e0] p-3.5 text-white shadow-lg sm:p-5">
                    <div className="mb-2 flex items-center gap-1.5">
                      <Target className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" aria-hidden />
                      <h2 className="text-base font-bold sm:text-lg">Predicted Outcomes</h2>
                    </div>
                    <div className="space-y-2 sm:space-y-2.5">
                      <div className="rounded-lg bg-white/15 p-3 backdrop-blur-sm sm:p-3.5">
                        <div className="mb-0.5 flex items-center gap-1.5">
                          <AlertCircle className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" aria-hidden />
                          <span className="text-sm font-bold">If No Action Taken:</span>
                        </div>
                        <p className="text-xs leading-snug text-white/95 sm:text-sm sm:leading-relaxed">
                          {ip.predictedOutcomes.ifNoAction}
                        </p>
                      </div>
                      <div className="rounded-lg bg-white/15 p-3 backdrop-blur-sm sm:p-3.5">
                        <div className="mb-0.5 flex items-center gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" aria-hidden />
                          <span className="text-sm font-bold">If Action Taken:</span>
                        </div>
                        <p className="text-xs leading-snug text-white/95 sm:text-sm sm:leading-relaxed">
                          {ip.predictedOutcomes.ifActionTaken}
                        </p>
                      </div>
                    </div>
                  </section>
              </>
            ) : (
              <p className="text-sm text-slate-500">Insights are not available for this pillar.</p>
            )}
          </TabsContent>

          <TabsContent value="sectors" className="mt-0 focus-visible:outline-none">
            <div className="grid gap-3 sm:grid-cols-2">
              {pillar.sectorTabCards.map((card) => {
                const Icon = sectorTabIcons[card.icon] || BarChart3;
                return (
                  <div
                    key={card.title}
                    className="rounded-xl border border-slate-200 bg-white p-3.5 sm:p-4"
                  >
                    <div className="mb-2 flex gap-2.5">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-100 text-blue-600">
                        <Icon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2} aria-hidden />
                      </div>
                      <h3 className="pt-0.5 text-sm font-bold leading-snug text-slate-900 sm:text-base">
                        {card.title}
                      </h3>
                    </div>
                    <p className="mb-3 text-xs leading-snug text-slate-600 sm:mb-3 sm:text-sm sm:leading-relaxed">{card.description}</p>
                    <p className="mb-1.5 text-xs font-bold text-slate-900 sm:text-sm">Key Benefits:</p>
                    <ul className="space-y-1.5 sm:space-y-2">
                      {card.keyBenefits.map((benefit, i) => (
                        <li key={i} className="flex gap-2 text-xs leading-snug text-slate-700 sm:text-sm sm:leading-relaxed">
                          <span
                            className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm"
                            aria-hidden
                          >
                            <Check className="h-3 w-3 stroke-[3]" />
                          </span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="features" className="mt-0 space-y-4 focus-visible:outline-none">
            {pillar.featureGoalCards.map((card, i) => (
              <article
                key={`${card.title}-${i}`}
                className="rounded-lg border-2 border-emerald-500 bg-white p-3.5 shadow-sm sm:p-4"
              >
                <header className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start gap-2.5">
                      <Bookmark
                        className="mt-0.5 h-5 w-5 shrink-0 fill-emerald-500/15 text-emerald-600"
                        strokeWidth={2}
                        aria-hidden
                      />
                      <h3 className="text-base font-bold leading-snug text-slate-900 sm:text-lg">{card.title}</h3>
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 sm:text-sm">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400 sm:h-4 sm:w-4" aria-hidden />
                      <span>{card.location}</span>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5 text-xs text-slate-500 sm:pt-0.5 sm:text-sm">
                    <Calendar className="h-3.5 w-3.5 shrink-0 text-slate-400 sm:h-4 sm:w-4" aria-hidden />
                    <span>{card.date}</span>
                  </div>
                </header>

                <div className="mb-3 rounded-lg bg-emerald-50 px-3 py-2.5 ring-1 ring-emerald-100 sm:px-3.5 sm:py-3">
                  <p className="mb-0.5 text-xs font-bold text-emerald-800 sm:text-sm">Achievement</p>
                  <p className="text-xs font-medium leading-snug text-emerald-900 sm:text-sm sm:leading-relaxed">{card.achievement}</p>
                </div>

                <div className="mb-3">
                  <p className="mb-1 text-xs font-bold text-slate-900 sm:text-sm">Story</p>
                  <p className="text-xs leading-snug text-slate-700 sm:text-sm sm:leading-relaxed">{card.story}</p>
                </div>

                <div className="rounded-lg bg-sky-50 px-3 py-2.5 ring-1 ring-sky-100 sm:px-3.5 sm:py-3">
                  <p className="mb-0.5 text-xs font-bold text-[#1E3A8A] sm:text-sm">Impact</p>
                  <p className="text-xs font-medium leading-snug text-blue-900 sm:text-sm sm:leading-relaxed">{card.impact}</p>
                </div>
              </article>
            ))}
          </TabsContent>

          <TabsContent value="theme" className="mt-0 space-y-4 focus-visible:outline-none">
            {pillar.themeCards.map((card, i) => (
              <article
                key={`theme-${card.title}-${i}`}
                className="overflow-hidden rounded-lg border border-slate-200 border-t-[4px] border-t-emerald-500 bg-white shadow-sm"
              >
                <div className="p-3.5 sm:p-4">
                  <header className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start gap-2">
                        <Award
                          className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 sm:h-5 sm:w-5"
                          strokeWidth={2}
                          aria-hidden
                        />
                        <h3 className="text-base font-bold leading-snug text-slate-900 sm:text-lg">{card.title}</h3>
                      </div>
                      <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 sm:text-sm">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400 sm:h-4 sm:w-4" aria-hidden />
                        <span>{card.location}</span>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5 text-xs text-slate-500 sm:pt-0.5 sm:text-sm">
                      <Calendar className="h-3.5 w-3.5 shrink-0 text-slate-400 sm:h-4 sm:w-4" aria-hidden />
                      <span>{card.date}</span>
                    </div>
                  </header>

                  <div className="mb-3 rounded-lg bg-[#E8F5E9] px-3 py-2.5 sm:px-3.5 sm:py-3">
                    <p className="mb-0.5 text-xs font-bold text-emerald-900 sm:text-sm">Achievement</p>
                    <p className="text-xs font-normal leading-snug text-emerald-900 sm:text-sm sm:leading-relaxed">{card.achievement}</p>
                  </div>

                  <div className="mb-3">
                    <p className="mb-1 text-xs font-bold text-slate-900 sm:text-sm">Story</p>
                    <p className="text-xs font-normal leading-snug text-slate-900 sm:text-sm sm:leading-relaxed">{card.story}</p>
                  </div>

                  <div className="rounded-lg bg-[#E3F2FD] px-3 py-2.5 sm:px-3.5 sm:py-3">
                    <p className="mb-0.5 text-xs font-bold text-[#1565C0] sm:text-sm">Impact</p>
                    <p className="text-xs font-normal leading-snug text-[#0D47A1] sm:text-sm sm:leading-relaxed">{card.impact}</p>
                  </div>
                </div>
              </article>
            ))}
          </TabsContent>

          <TabsContent value="initiatives" className="mt-0 space-y-4 focus-visible:outline-none">
            {pillar.strategicInitiativeCards.map((card, i) => (
              <article
                key={`init-${card.title}-${i}`}
                className="flex overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
              >
                <div
                  className="w-1 shrink-0 bg-emerald-500 sm:w-1.5"
                  aria-hidden
                />
                <div className="min-w-0 flex-1 p-3.5 sm:p-4">
                  <header className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start gap-2">
                        <Award
                          className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 sm:h-5 sm:w-5"
                          strokeWidth={2}
                          aria-hidden
                        />
                        <h3 className="text-base font-bold leading-snug text-slate-900 sm:text-lg">{card.title}</h3>
                      </div>
                      <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 sm:text-sm">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400 sm:h-4 sm:w-4" aria-hidden />
                        <span>{card.location}</span>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5 text-xs text-slate-500 sm:pt-0.5 sm:text-sm">
                      <Calendar className="h-3.5 w-3.5 shrink-0 text-slate-400 sm:h-4 sm:w-4" aria-hidden />
                      <span>{card.date}</span>
                    </div>
                  </header>

                  <div className="mb-3 rounded-lg bg-[#E8F5E9] px-3 py-2.5 sm:px-3.5 sm:py-3">
                    <p className="mb-0.5 text-xs font-bold text-emerald-900 sm:text-sm">Achievement</p>
                    <p className="text-xs font-normal leading-snug text-emerald-900 sm:text-sm sm:leading-relaxed">{card.achievement}</p>
                  </div>

                  <div className="mb-3">
                    <p className="mb-1 text-xs font-bold text-slate-900 sm:text-sm">Story</p>
                    <p className="text-xs font-normal leading-snug text-slate-900 sm:text-sm sm:leading-relaxed">{card.story}</p>
                  </div>

                  <div className="rounded-lg bg-[#E3F2FD] px-3 py-2.5 sm:px-3.5 sm:py-3">
                    <p className="mb-0.5 text-xs font-bold text-[#1565C0] sm:text-sm">Impact</p>
                    <p className="text-xs font-normal leading-snug text-[#0D47A1] sm:text-sm sm:leading-relaxed">{card.impact}</p>
                  </div>
                </div>
              </article>
            ))}
          </TabsContent>

            </div>
          </Tabs>
        </div>

        <nav className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5">
          {idx > 0 ? (
            <Link
              to={`/pillars/${PILLAR_ORDER[idx - 1]}`}
              className="text-sm font-medium text-[#1E3A8A] hover:underline"
            >
              ← {getPillarContent(PILLAR_ORDER[idx - 1]).title}
            </Link>
          ) : (
            <span />
          )}
          {idx < PILLAR_ORDER.length - 1 ? (
            <Link
              to={`/pillars/${PILLAR_ORDER[idx + 1]}`}
              className="text-sm font-medium text-[#1E3A8A] hover:underline"
            >
              {getPillarContent(PILLAR_ORDER[idx + 1]).title} →
            </Link>
          ) : (
            <span />
          )}
        </nav>

        <footer className="mt-6 border-t border-slate-200 pt-5 text-center text-[11px] leading-snug text-slate-500 sm:text-xs sm:leading-normal">
          <p>
            Content structured from the <strong>Odisha Vision 2036 &amp; 2047</strong> documents (English),
            including the Executive Summary and pillar chapters - Planning &amp; Convergence Department,
            Government of Odisha. Indicative targets are as stated in the Vision; implementation evolves
            with policy updates.
          </p>
          <p className="mt-1.5">
            Official reference:{" "}
            <a
              href="https://vision.odisha.gov.in"
              className="text-[#1E3A8A] underline hover:no-underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              vision.odisha.gov.in
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
};

export default PillarPage;
