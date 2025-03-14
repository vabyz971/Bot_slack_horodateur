interface FormState {
  horodateur?: string;
  periode?: string;
  presence?: string;
  competence?: string;
  note?: string;
}

const formState = new Map<string, FormState>();

export {FormState, formState};