# Get results on dev set
import json
from squad_setup import get_context, extract_answer
from tqdm import tqdm
# Load dev json
dev_json = json.load(open("./dev-v2.0.json", "r"))

# Get all questions
questions = []
for article in dev_json["data"]:
    for ques in article['paragraphs']:
        for qas in ques['qas']:
            questions.append({
                'question': qas['question'],
                'id':  qas['id']
            })
print(f"Total questions: {len(questions)}")

# Get all predictions
answers = {}
for question in tqdm(questions):
    # get context passages
    context = get_context(question["question"], top_k=3)
    # extract answer
    answer = extract_answer(question["question"], context)
    # add to answers dict
    answers[question["id"]] = answer[0]['answer']
    # print(f"Question: {question['question']}")
    # print(f"Answer: {answer[0]['answer']}")


# Save answer to json
with open("answers.json", "w") as f:
    json.dump(answers, f)




