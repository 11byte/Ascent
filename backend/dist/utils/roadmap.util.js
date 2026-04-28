export const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
export const cleanAIResponse = (text) => {
    // Removes markdown backticks if Gemini includes them
    return text.replace(/```json|```/g, "").trim();
};
export const transformToTree = (query, chapters) => {
    return {
        name: capitalize(query),
        children: Object.keys(chapters).map((chapterName) => ({
            name: chapterName,
            children: chapters[chapterName].map((module) => ({
                name: module.moduleName,
                moduleDescription: module.moduleDescription,
                link: module.link || `https://en.wikipedia.org/wiki/${encodeURIComponent(module.moduleName)}`,
            })),
        })),
    };
};
