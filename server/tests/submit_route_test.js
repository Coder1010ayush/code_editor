const axios = require('axios');
const mongoose = require('mongoose');

const BASE_URL = 'http://localhost:5001/api/submit';

const QUESTION_ID = '6643f172aef4dce3b237b12a'; 

const exampleSubmission = {
  username: 'test_user',
  question_id: QUESTION_ID,
  submitted_code: 'print("Hello, world!")',
  result: 'Success',
  lang: 'python'
};

const test = async () => {
  try {
    // Create a new submission
    console.log('\nCreating new submission...');
    const postRes = await axios.post(BASE_URL, exampleSubmission);
    const newSubmissionId = postRes.data._id;
    console.log('Submission saved with ID:', newSubmissionId);

    // Fetch submissions by problemId and username
    console.log('\nFetching submissions for problem ID and username...');
    const getByProblem = await axios.get(`${BASE_URL}/${QUESTION_ID}`, {
      params: { username: exampleSubmission.username }
    });
    console.log(`Submissions found: ${getByProblem.data.length}`);
    console.log('Latest submission:', getByProblem.data[0]);

    // Fetch all submissions by username
    console.log('\nFetching all submissions by username...');
    const getByUser = await axios.get(`${BASE_URL}/user/${exampleSubmission.username}`);
    console.log(`Total submissions by ${exampleSubmission.username}: ${getByUser.data.length}`);
    console.log('Latest:', getByUser.data[0]);

  } catch (err) {
    if (err.response) {
      console.error('Error:', err.response.status, err.response.data);
    } else {
      console.error('Error:', err.message);
    }
  }
};

test();
