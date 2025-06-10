Study Buddy AI is an AI-powered web application designed to help students study smarter. Upload your notes (PDF, DOCX, or TXT), and Study Buddy AI will automatically generate flashcards, quizzes, and personalized improvement suggestions—making exam prep easier and more effective. The app supports multiple languages, so you can study in English, French, Spanish, or any language your notes are written in.

<img width="1447" alt="Screenshot 2025-06-10 at 3 02 40 PM" src="https://github.com/user-attachments/assets/2fcbcc65-73c6-431e-acce-08782a8ae796" />

Sign in using your Google, or create an account to start studying smarter!

This project uses Next.js, React, and Tailwind CSS for front-end design. It also uses Firebase Auth for secure user authentication and AWS (DynamoDB, IAM) for user database and identity management. Additionally, I used Formidable to handle file uploads and the Anthropic Claude 3 API for the AI portion of this application.


<img width="1442" alt="Screenshot 2025-06-10 at 3 09 30 PM" src="https://github.com/user-attachments/assets/4d68440b-e696-4041-8b82-93f67ea972ca" />

From the dashboard, the user can decide between practice questions & quizzes, or, send a help email if they encounter any issues.

**Practice Questions**


<img width="1443" alt="Screenshot 2025-06-10 at 3 14 05 PM" src="https://github.com/user-attachments/assets/e5d03143-534b-4daf-a0b4-7edf8a3767e8" />

After uploading the file, you should see questions generated. Clicking the cards with these questions will show you the answer. You can also choose to generate new questions.

<img width="1443" alt="Screenshot 2025-06-10 at 3 14 52 PM" src="https://github.com/user-attachments/assets/521b02d4-7606-4ab2-94d5-6c30ac57e193" />

**Practice Quiz**

Upload a file and select "Start Quiz" to select your quiz options.

<img width="1446" alt="Screenshot 2025-06-10 at 3 17 03 PM" src="https://github.com/user-attachments/assets/96901973-2638-44d6-8df7-3eab6dd6f95f" />

You can choose whether you'd like to add a timer to each question or not, as well as the number of questions. Currently this is capped at 5 due to the LLM, however I have plans to increase this.

<img width="943" alt="Screenshot 2025-06-10 at 3 17 41 PM" src="https://github.com/user-attachments/assets/2bc3fa9f-

Once you start the quiz, a timer should show in the top left corner. You can select a question and will be informed if you were correct or incorrect.

<img width="1442" alt="Screenshot 2025-06-10 at 3 19 08 PM" src="https://github.com/user-attachments/assets/7784a6a7-2f4c-4ce7-813b-533cfaaffb4b" />
5340-4435-b3ce-e45be1ad0996" />

<img width="825" alt="Screenshot 2025-06-10 at 3 18 57 PM" src="https://github.com/user-attachments/assets/bc74a8f5-2cc3-4502-97d3-ac6b7a300d1c" />

Once the quiz is completed, you'll recieve your results.

<img width="723" alt="Screenshot 2025-06-10 at 3 20 09 PM" src="https://github.com/user-attachments/assets/e9040c81-4ad9-4d74-a599-d9fa3b04d4d5" />

This project is currently deployed and you're able to use it. I have plans to improve it using personalized areas of improvement based on cached user data.

