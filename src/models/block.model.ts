export interface Block {
    id: string;
    type: String;
    attributes: {
        index: number;
        timestamp: number;
        data: string;
        hash: string;
    };
}
