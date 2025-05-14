// testAddContest.js
const axios = require('axios');
const BASE_URL = 'http://localhost:5001/api/contests';

const testAddContest = async () => {
    
    try {
        const response = await axios.post('http://localhost:5001/api/add-contest', 
            {
                "name": "Monthly Challenge",
                "start_time": "2025-05-20T12:00:00.000Z",
                "end_time": "2025-05-20T15:00:00.000Z",
                "participants": [
                  {
                    "username": "alice",
                    "attempted": [
                      {
                        "qid": "66437395e5fba9e2e1c3d12a",
                        "sid": "66437395e5fba9e2e1c3d12b",
                        "marks": 4,
                        "kind": "code"
                      }
                    ],
                    "latest_time": "2025-05-14T09:00:00.000Z",
                    "curr_score": 4
                  }
                ],
                "questions": ["66437395e5fba9e2e1c3d12a", "66437395e5fba9e2e1c3d12c"],
                "contest_no": 7,
                "descr": {
                  "rules": [
                    "Submit before time ends.",
                    "Do not copy from others."
                  ],
                  "marking": {
                    "Easy": 2,
                    "Medium": 3,
                    "Hard": 5
                  }
                },
                "status": "open",
                "visibility": "public"
              }
              
        );

        console.log('Status:', response.status);
        console.log('Response:', response.data);
    } catch (error) {
        if (error.response) {
            console.error('Error response:', error.response.status, error.response.data);
        } else {
            console.error('Error:', error.message);
        }
    }
};




const exampleContest = {
  name: 'Test Contest',
  start_time: new Date(Date.now() + 3600000), 
  end_time: new Date(Date.now() + 7200000),   
  participants: [],
  questions: [], 
  contest_no: 99,
  descr: {
    rules: ['No cheating', 'Submit before deadline'],
    marking: {
      Easy: 2,
      Medium: 3,
      Hard: 5
    }
  },
  status: 'open',
  visibility: 'public'
};

let contestId = null;

const test = async () => {
  try {
    // Create Contest
    console.log('Creating contest...');
    const createRes = await axios.post(BASE_URL, exampleContest);
    console.log('Created:', createRes.data);
    contestId = createRes.data._id;

    // Get All Contests
    console.log('\nFetching all contests...');
    const allContests = await axios.get(BASE_URL);
    console.log('All Contests Count:', allContests.data.length);

    // Get Contest by ID
    console.log('\nFetching contest by ID...');
    const oneContest = await axios.get(`${BASE_URL}/${contestId}`);
    console.log('Fetched Contest:', oneContest.data.name);

    // Join Contest
    console.log('\nJoining contest...');
    const joinRes = await axios.put(`${BASE_URL}/${contestId}/join`, {
      username: 'test_user'
    });
    console.log('Joined Contest Participants:', joinRes.data.participants.map(p => p.username));

    // Update Contest
    console.log('\nUpdating contest...');
    const updateRes = await axios.put(`${BASE_URL}/${contestId}`, {
      name: 'Updated Test Contest'
    });
    console.log('Updated Name:', updateRes.data.name);

    // Update via `/update-contest/:id`
    console.log('\nUpdating contest with /update-contest route...');
    const updateAltRes = await axios.put(`${BASE_URL}/update-contest/${contestId}`, {
      visibility: 'private'
    });
    console.log('Updated Visibility:', updateAltRes.data.contest.visibility);

    // Delete Contest
    console.log('\nDeleting contest...');
    const deleteRes = await axios.delete(`${BASE_URL}/${contestId}`);
    console.log(deleteRes.data.message);

    // Verify Deletion
    console.log('\nVerifying deletion...');
    await axios.get(`${BASE_URL}/${contestId}`);
  } catch (err) {
    if (err.response) {
      console.error('Error:', err.response.status, err.response.data);
    } else {
      console.error('Error:', err.message);
    }
  }
};

// test();
// testAddContest();
