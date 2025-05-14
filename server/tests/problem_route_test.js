const axios = require('axios');

const BASE_URL = 'http://localhost:5001/api/problems';

const exampleProblem = {
  title: 'Two Sum',
  question: 'Given an array of integers, return indices of the two numbers such that they add up to a specific target.',
  difficulty: 'Easy',
  category: 'Array',
  descr: {
    constraints: ['1 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9'],
    input_format: 'An array of integers and a target value',
    output_format: 'Indices of the two numbers'
  },
  test_cases: [
    { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]' },
    { input: 'nums = [3,2,4], target = 6', output: '[1,2]' }
  ]
};

let problemId = null;

const test = async () => {
  try {
    // Create Problem
    console.log('Creating a new problem...');
    const createRes = await axios.post(BASE_URL, exampleProblem);
    console.log('Created Problem:', createRes.data.title);
    problemId = createRes.data._id;

    // Fetch All Problems
    console.log('\nFetching all problems (list)...');
    const allProblems = await axios.get(BASE_URL);
    console.log('Problems Count:', allProblems.data.length);
    console.log('Sample Entry:', allProblems.data[0]);

    // Fetch Problem by ID
    console.log('\nFetching problem by ID...');
    const oneProblem = await axios.get(`${BASE_URL}/${problemId}`);
    console.log('Fetched Problem:', oneProblem.data.title);
    console.log('Description:', oneProblem.data.description);

    // Delete for cleanup 
    // console.log('\nDeleting problem...');
    // await axios.delete(`${BASE_URL}/${problemId}`);
    // console.log('Deleted problem:', problemId);

  } catch (err) {
    if (err.response) {
      console.error('Error:', err.response.status, err.response.data);
    } else {
      console.error('Error:', err.message);
    }
  }
};

test();
