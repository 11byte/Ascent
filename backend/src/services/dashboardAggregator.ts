export function aggregateStudentData(user: any, kafkaData: any) {
  const gitContribs = kafkaData.github.length * 5;

  const leetSolved = kafkaData.quiz.length * 2;

  const behaviorScore = Math.min(
    100,
    kafkaData.quiz.length * 5 +
      kafkaData.github.length * 3 +
      kafkaData.blog.length * 2,
  );

  const latestSession = user.trackerSessions?.sort(
    (a: any, b: any) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )[0];

  const domains = latestSession?.assignedDomain
    ? [latestSession.assignedDomain]
    : [];

  return {
    gitContribs,
    leetSolved,
    behaviorScore,
    domains,
    timelineScore: [20, 40, 60, behaviorScore],
  };
}
