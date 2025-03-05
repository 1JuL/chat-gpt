export interface APIResponse {
    candidates:    Candidate[];
    usageMetadata: UsageMetadata;
    modelVersion:  string;
}

export interface Candidate {
    content:          Content;
    finishReason:     string;
    citationMetadata: CitationMetadata;
    avgLogprobs:      number;
}

export interface CitationMetadata {
    citationSources: CitationSource[];
}

export interface CitationSource {
    startIndex: number;
    endIndex:   number;
    uri?:       string;
}

export interface Content {
    parts: Part[];
    role:  string;
}

export interface Part {
    text: string;
}

export interface UsageMetadata {
    promptTokenCount:        number;
    candidatesTokenCount:    number;
    totalTokenCount:         number;
    promptTokensDetails:     TokensDetail[];
    candidatesTokensDetails: TokensDetail[];
}

export interface TokensDetail {
    modality:   string;
    tokenCount: number;
}

export interface Message {
    text: string;
    sender_by: "Bot" | "User";
    date: Date;
    state: "Sent" | "Received";
}