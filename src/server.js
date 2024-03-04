import { Router } from 'itty-router';
class JsonResponse extends Response {
	constructor(body, init) {
	  const jsonBody = JSON.stringify(body);
	  init = init || {
		headers: {
		  'content-type': 'application/json;charset=UTF-8',
		},
	  };
	  super(jsonBody, init);
	}
  }
  
// now let's create a router (note the lack of "new")
const router = Router();

// GET collection index

router.post('/api/getprof', async (request) => {
	console.log(request)
	const reqdat = await request.json()
	console.log(reqdat)

	let modName = reqdat.name;
    if (modName.slice(-1) === '.') {
        modName = modName.slice(0, -2);
    }
	let maxNumRatings = 0;
    let maxData = null;
	const postData = {
		query: "query TeacherSearchResultsPageQuery(\n  $query: TeacherSearchQuery!\n  $schoolID: ID\n  $includeSchoolFilter: Boolean!\n) {\n  search: newSearch {\n    ...TeacherSearchPagination_search_1ZLmLD\n  }\n  school: node(id: $schoolID) @include(if: $includeSchoolFilter) {\n    __typename\n    ... on School {\n      name\n    }\n    id\n  }\n}\n\nfragment TeacherSearchPagination_search_1ZLmLD on newSearch {\n  teachers(query: $query, first: 8, after: \"\") {\n    didFallback\n    edges {\n      cursor\n      node {\n        ...TeacherCard_teacher\n        id\n        __typename\n      }\n    }\n    pageInfo {\n      hasNextPage\n      endCursor\n    }\n    resultCount\n    filters {\n      field\n      options {\n        value\n        id\n      }\n    }\n  }\n}\n\nfragment TeacherCard_teacher on Teacher {\n  id\n  legacyId\n  avgRating\n  numRatings\n  ...CardFeedback_teacher\n  ...CardSchool_teacher\n  ...CardName_teacher\n  ...TeacherBookmark_teacher\n}\n\nfragment CardFeedback_teacher on Teacher {\n  wouldTakeAgainPercent\n  avgDifficulty\n}\n\nfragment CardSchool_teacher on Teacher {\n  department\n  school {\n    name\n    id\n  }\n}\n\nfragment CardName_teacher on Teacher {\n  firstName\n  lastName\n}\n\nfragment TeacherBookmark_teacher on Teacher {\n  id\n  isSaved\n}\n",
		variables: {
		  query: {
			text: modName,
			schoolID: "",
			fallback: true,
			departmentID: null
		  },
		  schoolID: "",
		  includeSchoolFilter: false
		}
	  }
	  const termSearchResponse = await fetch("https://www.ratemyprofessors.com/graphql", {
		method: "POST",
		headers: {
			"User-Agent" : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36",
			"Content-Type": "application/json",
      "Authorization": "Basic dGVzdDp0ZXN0"

		},
		body: JSON.stringify(postData),
		redirect: "follow"
		
	});
  const a = await termSearchResponse.json()
  let nd;
  if (a) {
  a.data.search.teachers.edges.map(x => {
    if (x.node.school.name.includes("Georgia State University")) {
    if (x.node.numRatings>maxNumRatings) {
		maxNumRatings = x.node.numRatings;
		maxData = [x.node.numRatings, x.node.avgDifficulty, x.node.avgRating, x.node.wouldTakeAgainPercent, x.node.legacyId,x.node.id]
	}
}
  })}
  
  if (!maxData) {
	return new JsonResponse({})
  }




  const r2 = {
	query: "query TeacherRatingsPageQuery(\n $id: ID!\n) {\n node(id: $id) {\n __typename\n ... on Teacher {\n id\n legacyId\n firstName\n lastName\n department\n school {\n legacyId\n name\n city\n state\n country\n id\n }\n lockStatus\n ...StickyHeader_teacher\n ...RatingDistributionWrapper_teacher\n ...TeacherInfo_teacher\n ...SimilarProfessors_teacher\n ...TeacherRatingTabs_teacher\n }\n id\n }\n}\n\nfragment StickyHeader_teacher on Teacher {\n ...HeaderDescription_teacher\n ...HeaderRateButton_teacher\n}\n\nfragment RatingDistributionWrapper_teacher on Teacher {\n ...NoRatingsArea_teacher\n ratingsDistribution {\n total\n ...RatingDistributionChart_ratingsDistribution\n }\n}\n\nfragment TeacherInfo_teacher on Teacher {\n id\n lastName\n numRatings\n ...RatingValue_teacher\n ...NameTitle_teacher\n ...TeacherTags_teacher\n ...NameLink_teacher\n ...TeacherFeedback_teacher\n ...RateTeacherLink_teacher\n ...CompareProfessorLink_teacher\n}\n\nfragment SimilarProfessors_teacher on Teacher {\n department\n relatedTeachers {\n legacyId\n ...SimilarProfessorListItem_teacher\n id\n }\n}\n\nfragment TeacherRatingTabs_teacher on Teacher {\n numRatings\n courseCodes {\n courseName\n courseCount\n }\n ...RatingsList_teacher\n ...RatingsFilter_teacher\n}\n\nfragment RatingsList_teacher on Teacher {\n id\n legacyId\n lastName\n numRatings\n school {\n id\n legacyId\n name\n city\n state\n avgRating\n numRatings\n }\n ...Rating_teacher\n ...NoRatingsArea_teacher\n ratings(first: 20) {\n edges {\n cursor\n node {\n ...Rating_rating\n id\n __typename\n }\n }\n pageInfo {\n hasNextPage\n endCursor\n }\n }\n}\n\nfragment RatingsFilter_teacher on Teacher {\n courseCodes {\n courseCount\n courseName\n }\n}\n\nfragment Rating_teacher on Teacher {\n ...RatingFooter_teacher\n ...RatingSuperHeader_teacher\n ...ProfessorNoteSection_teacher\n}\n\nfragment NoRatingsArea_teacher on Teacher {\n lastName\n ...RateTeacherLink_teacher\n}\n\nfragment Rating_rating on Rating {\n comment\n flagStatus\n createdByUser\n teacherNote {\n id\n }\n ...RatingHeader_rating\n ...RatingSuperHeader_rating\n ...RatingValues_rating\n ...CourseMeta_rating\n ...RatingTags_rating\n ...RatingFooter_rating\n ...ProfessorNoteSection_rating\n}\n\nfragment RatingHeader_rating on Rating {\n legacyId\n date\n class\n helpfulRating\n clarityRating\n isForOnlineClass\n}\n\nfragment RatingSuperHeader_rating on Rating {\n legacyId\n}\n\nfragment RatingValues_rating on Rating {\n helpfulRating\n clarityRating\n difficultyRating\n}\n\nfragment CourseMeta_rating on Rating {\n attendanceMandatory\n wouldTakeAgain\n grade\n textbookUse\n isForOnlineClass\n isForCredit\n}\n\nfragment RatingTags_rating on Rating {\n ratingTags\n}\n\nfragment RatingFooter_rating on Rating {\n id\n comment\n adminReviewedAt\n flagStatus\n legacyId\n thumbsUpTotal\n thumbsDownTotal\n thumbs {\n thumbsUp\n thumbsDown\n computerId\n id\n }\n teacherNote {\n id\n }\n ...Thumbs_rating\n}\n\nfragment ProfessorNoteSection_rating on Rating {\n teacherNote {\n ...ProfessorNote_note\n id\n }\n ...ProfessorNoteEditor_rating\n}\n\nfragment ProfessorNote_note on TeacherNotes {\n comment\n ...ProfessorNoteHeader_note\n ...ProfessorNoteFooter_note\n}\n\nfragment ProfessorNoteEditor_rating on Rating {\n id\n legacyId\n class\n teacherNote {\n id\n teacherId\n comment\n }\n}\n\nfragment ProfessorNoteHeader_note on TeacherNotes {\n createdAt\n updatedAt\n}\n\nfragment ProfessorNoteFooter_note on TeacherNotes {\n legacyId\n flagStatus\n}\n\nfragment Thumbs_rating on Rating {\n id\n comment\n adminReviewedAt\n flagStatus\n legacyId\n thumbsUpTotal\n thumbsDownTotal\n thumbs {\n computerId\n thumbsUp\n thumbsDown\n id\n }\n teacherNote {\n id\n }\n}\n\nfragment RateTeacherLink_teacher on Teacher {\n legacyId\n numRatings\n lockStatus\n}\n\nfragment RatingFooter_teacher on Teacher {\n id\n legacyId\n lockStatus\n isProfCurrentUser\n ...Thumbs_teacher\n}\n\nfragment RatingSuperHeader_teacher on Teacher {\n firstName\n lastName\n legacyId\n school {\n name\n id\n }\n}\n\nfragment ProfessorNoteSection_teacher on Teacher {\n ...ProfessorNote_teacher\n ...ProfessorNoteEditor_teacher\n}\n\nfragment ProfessorNote_teacher on Teacher {\n ...ProfessorNoteHeader_teacher\n ...ProfessorNoteFooter_teacher\n}\n\nfragment ProfessorNoteEditor_teacher on Teacher {\n id\n}\n\nfragment ProfessorNoteHeader_teacher on Teacher {\n lastName\n}\n\nfragment ProfessorNoteFooter_teacher on Teacher {\n legacyId\n isProfCurrentUser\n}\n\nfragment Thumbs_teacher on Teacher {\n id\n legacyId\n lockStatus\n isProfCurrentUser\n}\n\nfragment SimilarProfessorListItem_teacher on RelatedTeacher {\n legacyId\n firstName\n lastName\n avgRating\n}\n\nfragment RatingValue_teacher on Teacher {\n avgRating\n numRatings\n ...NumRatingsLink_teacher\n}\n\nfragment NameTitle_teacher on Teacher {\n id\n firstName\n lastName\n department\n school {\n legacyId\n name\n id\n }\n ...TeacherDepartment_teacher\n ...TeacherBookmark_teacher\n}\n\nfragment TeacherTags_teacher on Teacher {\n lastName\n teacherRatingTags {\n legacyId\n tagCount\n tagName\n id\n }\n}\n\nfragment NameLink_teacher on Teacher {\n isProfCurrentUser\n id\n legacyId\n firstName\n lastName\n school {\n name\n id\n }\n}\n\nfragment TeacherFeedback_teacher on Teacher {\n numRatings\n avgDifficulty\n wouldTakeAgainPercent\n}\n\nfragment CompareProfessorLink_teacher on Teacher {\n legacyId\n}\n\nfragment TeacherDepartment_teacher on Teacher {\n department\n departmentId\n school {\n legacyId\n name\n id\n }\n}\n\nfragment TeacherBookmark_teacher on Teacher {\n id\n isSaved\n}\n\nfragment NumRatingsLink_teacher on Teacher {\n numRatings\n ...RateTeacherLink_teacher\n}\n\nfragment RatingDistributionChart_ratingsDistribution on ratingsDistribution {\n r1\n r2\n r3\n r4\n r5\n}\n\nfragment HeaderDescription_teacher on Teacher {\n id\n firstName\n lastName\n department\n school {\n legacyId\n name\n city\n state\n id\n }\n ...TeacherTitles_teacher\n ...TeacherBookmark_teacher\n}\n\nfragment HeaderRateButton_teacher on Teacher {\n ...RateTeacherLink_teacher\n}\n\nfragment TeacherTitles_teacher on Teacher {\n department\n school {\n legacyId\n name\n id\n }\n}\n",
	variables: {
	  id: maxData[5]
	}
  };
  const r2response = await fetch("https://www.ratemyprofessors.com/graphql", {
		method: "POST",
		headers: {
			"User-Agent" : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36",
			"Content-Type": "application/json",
      "Authorization": "Basic dGVzdDp0ZXN0"

		},
		body: JSON.stringify(r2),
		redirect: "follow"
		
	});
	const b = await r2response.json()
	//console.log(b)

	//return [b.data.node.numRatings, b.data.node.avgDifficulty,b.data.node.avgRating,b.data.node.wouldTakeAgainPercent,b.data.node.legacyId]
	const retDat = {
		numRatings: b.data.node.numRatings,
		avgDifficulty: b.data.node.avgDifficulty,
		avgRating: b.data.node.avgRating,
		wouldTakeAgain: b.data.node.wouldTakeAgainPercent,
		legacyId: b.data.node.legacyId,
	}

	return new JsonResponse(retDat)
  

	
});

// 404 for everything else
router.all('*', () => new Response('Not Found.', { status: 404 }));
const server = {
	
	fetch: async function (request, env) {
	  
	  return router.handle(request, env);
	},
	
  };
export default server;
