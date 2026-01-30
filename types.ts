
export interface EvaluationCriterion {
  criterion: string;
  indicators: string[];
}

export interface Field {
  field_name: string;
  final_competence: string;
  knowledge_resources: string[];
  evaluation_criteria: EvaluationCriterion[];
}

export interface GradeData {
  grade: number;
  grade_name: string;
  overall_competence: string;
  fields: Field[];
}

export interface Curriculum {
  curriculum_info: {
    country: string;
    subject: string;
    stage: string;
    structure_logic: string;
  };
  curriculum_data: GradeData[];
}
