package editorialradar

import (
	"encoding/json"
	"fmt"
	"net/url"
	"os"
	"path/filepath"
	"strings"

	"github.com/goccy/go-yaml"
)

const (
	contractPath = "docs/editorial-radar.md"
	sourcesPath  = "data/research-sources.yaml"
	signalsPath  = "data/research-signals.json"
	workflowPath = ".github/workflows/editorial-radar.md"
	lockPath     = ".github/workflows/editorial-radar.lock.yml"
	specPath     = "docs/superpowers/specs/2026-08-27-editorial-research-radar.md"
	planPath     = "docs/superpowers/plans/2026-08-27-issue-78-editorial-research-radar.md"
	readmePath   = "README.md"
)

type failureList []string

func (f *failureList) add(format string, args ...any) {
	*f = append(*f, fmt.Sprintf(format, args...))
}

// Validate checks the editorial radar contract, data files, workflow source,
// and supporting documentation under root.
func Validate(root string) []string {
	var failures failureList

	contract := requireFile(root, contractPath, &failures)
	sourcesText := requireFile(root, sourcesPath, &failures)
	signalsText := requireFile(root, signalsPath, &failures)
	workflow := requireFile(root, workflowPath, &failures)
	lock := requireFile(root, lockPath, &failures)
	spec := requireFile(root, specPath, &failures)
	plan := requireFile(root, planPath, &failures)
	readme := requireFile(root, readmePath, &failures)

	validateContract(contract, &failures)
	validateSources(sourcesText, &failures)
	validateSignals(signalsText, &failures)
	validateWorkflow(workflow, &failures)
	validateLock(lock, &failures)
	validateSpec(spec, &failures)
	validatePlan(plan, &failures)
	validateReadme(readme, &failures)

	return failures
}

func requireFile(root, path string, failures *failureList) string {
	fullPath := filepath.Join(root, filepath.FromSlash(path))
	info, err := os.Stat(fullPath)
	if err != nil {
		failures.add("%s is missing", path)
		return ""
	}
	if !info.Mode().IsRegular() {
		failures.add("%s is not a file", path)
		return ""
	}
	bytes, err := os.ReadFile(fullPath)
	if err != nil {
		failures.add("%s could not be read: %v", path, err)
		return ""
	}
	return string(bytes)
}

func requireIncludes(path, text string, phrases []string, failures *failureList) {
	if text == "" {
		return
	}
	for _, phrase := range phrases {
		if !strings.Contains(text, phrase) {
			failures.add("%s is missing required phrase: %s", path, phrase)
		}
	}
}

func validateContract(contract string, failures *failureList) {
	requireIncludes(contractPath, contract, []string{
		"external sources -> research agent -> research issue -> Ranjib review",
		"Disallowed path",
		"Evidence Hierarchy",
		"Lived-Experience Test",
		"Trend-Chasing Rejection Criteria",
		"Freshness Classes",
		"Research Scoring Rubric",
		"Privacy Rules",
		"Allowed Automated Outputs",
		"Prohibited Autonomous Outputs",
		"Human Approval Boundaries",
		"First Drift Fixture",
	}, failures)
}

type researchSources struct {
	SchemaVersion   string                                `yaml:"schema_version"`
	UpdatedAt       string                                `yaml:"updated_at"`
	AuthorityLevels map[string]string                     `yaml:"authority_levels"`
	Domains         map[string]map[string][]researchEntry `yaml:"domains"`
	ReviewPolicy    map[string]bool                       `yaml:"review_policy"`
}

type researchEntry struct {
	Name   string   `yaml:"name"`
	URL    string   `yaml:"url"`
	Topics []string `yaml:"topics"`
}

func validateSources(sourcesText string, failures *failureList) {
	if sourcesText == "" {
		return
	}

	var sources researchSources
	if err := yaml.Unmarshal([]byte(sourcesText), &sources); err != nil {
		failures.add("%s is not valid YAML: %v", sourcesPath, err)
		return
	}

	if sources.SchemaVersion != "editorial-research-sources-v1" {
		failures.add("%s has unexpected schema_version", sourcesPath)
	}
	for _, key := range []string{"primary", "ecosystem", "practitioner", "secondary"} {
		if strings.TrimSpace(sources.AuthorityLevels[key]) == "" {
			failures.add("%s authority_levels is missing %s", sourcesPath, key)
		}
	}
	for _, domain := range []string{"sre", "genai", "open_source_physical_computing", "hobbies"} {
		if len(sources.Domains[domain]) == 0 {
			failures.add("%s domains is missing %s", sourcesPath, domain)
		}
	}
	if !sources.ReviewPolicy["prefer_primary_sources"] {
		failures.add("%s review_policy.prefer_primary_sources must be true", sourcesPath)
	}
	if !sources.ReviewPolicy["secondary_sources_require_corroboration"] {
		failures.add("%s review_policy.secondary_sources_require_corroboration must be true", sourcesPath)
	}

	entries := flattenSources(sources.Domains)
	if len(entries) < 20 {
		failures.add("%s should include at least 20 source URLs; found %d", sourcesPath, len(entries))
	}
	for _, entry := range entries {
		if strings.TrimSpace(entry.Name) == "" {
			failures.add("%s contains a source without a name", sourcesPath)
		}
		parsed, err := url.Parse(entry.URL)
		if err != nil || parsed.Scheme == "" || parsed.Host == "" {
			failures.add("%s contains invalid source URL: %s", sourcesPath, entry.URL)
			continue
		}
		if parsed.Scheme != "https" {
			failures.add("%s contains non-HTTPS source URL: %s", sourcesPath, entry.URL)
		}
		if len(entry.Topics) == 0 {
			failures.add("%s source %q has no topics", sourcesPath, entry.Name)
		}
	}
}

func flattenSources(domains map[string]map[string][]researchEntry) []researchEntry {
	var entries []researchEntry
	for _, levels := range domains {
		for _, levelEntries := range levels {
			entries = append(entries, levelEntries...)
		}
	}
	return entries
}

type researchSignals struct {
	SchemaVersion string           `json:"schema_version"`
	UpdatedAt     string           `json:"updated_at"`
	Signals       []researchSignal `json:"signals"`
}

type researchSignal struct {
	Topic         string   `json:"topic"`
	FirstSeen     string   `json:"first_seen"`
	LastSeen      string   `json:"last_seen"`
	Occurrences   int      `json:"occurrences"`
	Sources       []string `json:"sources"`
	Velocity      string   `json:"velocity"`
	EditorialLane string   `json:"editorial_lane"`
	RelatedPosts  []string `json:"related_posts"`
	RelatedIssues []int    `json:"related_issues"`
	Status        string   `json:"status"`
}

func validateSignals(signalsText string, failures *failureList) {
	if signalsText == "" {
		return
	}

	var signals researchSignals
	decoder := json.NewDecoder(strings.NewReader(signalsText))
	decoder.DisallowUnknownFields()
	if err := decoder.Decode(&signals); err != nil {
		failures.add("%s is not valid JSON: %v", signalsPath, err)
		return
	}

	if signals.SchemaVersion != "editorial-research-signals-v1" {
		failures.add("%s has unexpected schema_version", signalsPath)
	}
	if strings.TrimSpace(signals.UpdatedAt) == "" {
		failures.add("%s is missing updated_at", signalsPath)
	}
	if signals.Signals == nil {
		failures.add("%s must contain a signals array", signalsPath)
		return
	}
	for index, signal := range signals.Signals {
		validateSignal(index, signal, failures)
	}
}

func validateSignal(index int, signal researchSignal, failures *failureList) {
	required := map[string]string{
		"topic":          signal.Topic,
		"first_seen":     signal.FirstSeen,
		"last_seen":      signal.LastSeen,
		"velocity":       signal.Velocity,
		"editorial_lane": signal.EditorialLane,
		"status":         signal.Status,
	}
	for field, value := range required {
		if strings.TrimSpace(value) == "" {
			failures.add("%s signal %d is missing %s", signalsPath, index, field)
		}
	}
	if signal.Occurrences < 0 {
		failures.add("%s signal %d occurrences must not be negative", signalsPath, index)
	}
	if signal.Sources == nil {
		failures.add("%s signal %d sources must be an array", signalsPath, index)
	}
	if signal.RelatedPosts == nil {
		failures.add("%s signal %d related_posts must be an array", signalsPath, index)
	}
	if signal.RelatedIssues == nil {
		failures.add("%s signal %d related_issues must be an array", signalsPath, index)
	}
	if !validStatus(signal.Status) {
		failures.add("%s signal %d has invalid status: %s", signalsPath, index, signal.Status)
	}
}

func validStatus(status string) bool {
	switch status {
	case "ignore", "watch", "experiment", "update-existing", "write", "seed":
		return true
	default:
		return false
	}
}

func validateWorkflow(workflow string, failures *failureList) {
	requireIncludes(workflowPath, workflow, []string{
		"engine: codex",
		"workflow_dispatch:",
		"tools:",
		"web-search:",
		"safe-outputs:",
		"create-issue:",
		"Read `docs/editorial-radar.md` first",
		"Do not create articles",
		"Do not modify published content",
	}, failures)
}

func validateLock(lock string, failures *failureList) {
	requireIncludes(lockPath, lock, []string{
		"# gh-aw-metadata:",
		"This file was automatically generated by gh-aw",
		"agent_id\":\"codex\"",
		"CODEX_API_KEY",
		"OPENAI_API_KEY",
	}, failures)
}

func validateSpec(spec string, failures *failureList) {
	requireIncludes(specPath, spec, []string{
		"Goal",
		"Scope",
		"Architecture",
		"Agentic Workflow MVP",
		"Non-Goals",
	}, failures)
}

func validatePlan(plan string, failures *failureList) {
	requireIncludes(planPath, plan, []string{
		"REQUIRED SUB-SKILL",
		"Task 1",
		"Task 2",
		"Task 3",
		"Task 4",
		"Task 5",
		"hugo --gc --minify",
		"go test ./...",
		"go run ./cmd/validate-editorial-radar",
	}, failures)
}

func validateReadme(readme string, failures *failureList) {
	if readme == "" {
		return
	}
	for _, stale := range []string{"Anatole theme", "themes/anatole", "git submodule update --init --recursive"} {
		if strings.Contains(readme, stale) {
			failures.add("README.md still contains stale Anatole theme/submodule guidance")
		}
	}
	requireIncludes(readmePath, readme, []string{
		"There is no Hugo theme submodule.",
		"docs/systems-in-practice-hub.md",
	}, failures)
}
