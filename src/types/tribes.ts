
export interface Tribe {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Squad {
  id: string;
  user_id: string;
  tribe_id: string;
  name: string;
  description?: string;
  jira_board_url?: string;
  created_at: string;
  updated_at: string;
  tribe?: Tribe;
}

export interface CreateTribeData {
  name: string;
  description?: string;
}

export interface CreateSquadData {
  name: string;
  description?: string;
  tribe_id: string;
  jira_board_url?: string;
}
