:- dynamic course/3.

intersection([], _, []).
intersection([H|T], L, [H|Res]) :- member(H, L), !, intersection(T, L, Res).
intersection([_|T], L, Res) :- intersection(T, L, Res).


match_field([], _) :- !.
match_field(PreferredFields, CourseHashtags) :-
    intersection(PreferredFields, CourseHashtags, Common),
    Common \= [].


match_difficulty(beginner, beginner).
match_difficulty(intermediate, beginner).
match_difficulty(intermediate, intermediate).
match_difficulty(advanced, intermediate).
match_difficulty(advanced, advanced).


adjust_difficulty(Age, _, _, _, beginner) :- Age < 13, !.
adjust_difficulty(_, none, _, _, beginner) :- !.
adjust_difficulty(_, basic, _, advanced, intermediate) :- !.
adjust_difficulty(_, _, _, PrefDiff, PrefDiff).



recommend_course(StemLevel, Fields, AcademicStatus, Age, PrefDifficulty, CourseID) :-
    course(CourseID, CourseHashtags, CourseLevel),
    adjust_difficulty(Age, StemLevel, AcademicStatus, PrefDifficulty, AdjustedDiff),
    match_difficulty(AdjustedDiff, CourseLevel),
    match_field(Fields, CourseHashtags).
