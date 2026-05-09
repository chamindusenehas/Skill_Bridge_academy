% -----------------------------------------------------------------------------
% AI Recommendation Engine - Knowledge Base
% -----------------------------------------------------------------------------

% Dynamic facts that will be loaded at runtime from the Flask backend
% course(ID, Hashtags, Level).
:- dynamic course/3.

% -----------------------------------------------------------------------------
% Helper Rules
% -----------------------------------------------------------------------------

% List Intersection helper
intersection([], _, []).
intersection([H|T], L, [H|Res]) :- member(H, L), !, intersection(T, L, Res).
intersection([_|T], L, Res) :- intersection(T, L, Res).

% match_field/2
% Succeeds if there is at least one common hashtag between user preferences and course hashtags,
% OR if the user didn't specify any fields.
match_field([], _) :- !.
match_field(PreferredFields, CourseHashtags) :-
    intersection(PreferredFields, CourseHashtags, Common),
    Common \= [].

% match_difficulty/2
% Defines which course levels are appropriate based on the user's adjusted difficulty capacity.
match_difficulty(beginner, beginner).
match_difficulty(intermediate, beginner).
match_difficulty(intermediate, intermediate).
match_difficulty(advanced, intermediate).
match_difficulty(advanced, advanced).

% adjust_difficulty/5
% adjust_difficulty(Age, StemLevel, AcademicStatus, PrefDifficulty, AdjustedDiff)
% Adjusts the difficulty based on user demographics and knowledge.

% Rule 1: Users under 13 are restricted to beginner courses.
adjust_difficulty(Age, _, _, _, beginner) :- Age < 13, !.

% Rule 2: Users with 'none' STEM knowledge are restricted to beginner courses.
adjust_difficulty(_, none, _, _, beginner) :- !.

% Rule 3: Users with 'basic' STEM knowledge but requesting 'advanced' get capped at 'intermediate'.
adjust_difficulty(_, basic, _, advanced, intermediate) :- !.

% Rule 4: Default - use their preferred difficulty.
adjust_difficulty(_, _, _, PrefDiff, PrefDiff).

% -----------------------------------------------------------------------------
% Main Recommendation Rule
% -----------------------------------------------------------------------------
% recommend_course/6
% recommend_course(StemLevel, Fields, AcademicStatus, Age, PrefDifficulty, CourseID)
recommend_course(StemLevel, Fields, AcademicStatus, Age, PrefDifficulty, CourseID) :-
    course(CourseID, CourseHashtags, CourseLevel),
    adjust_difficulty(Age, StemLevel, AcademicStatus, PrefDifficulty, AdjustedDiff),
    match_difficulty(AdjustedDiff, CourseLevel),
    match_field(Fields, CourseHashtags).
