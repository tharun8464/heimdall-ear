const XiNavaigationObject = {
    "roles": ["Candidate", "Interviewer"],
    "menu": [
        {
            "name": "Button Group",
            "icon": "",
            "path": "",
            "roles": ["Candidate", "Interviewer"],
            "enabled": true,
            "buttons": [
                {
                    "label": "Candidate",
                    "type": "button",
                    "class": "btn btn-primary",
                    "roles": ["Candidate"],
                    "shortLabel": "C",
                    "navItems": [
                        {
                            "name": "Dashboard",
                            "icon": "GridViewIcon",
                            "path": "/XI",
                            "roles": ["Candidate"],
                            "enabled": true,
                            "locked": false
                        },
                        {
                            "name": "Invitations",
                            "icon": "EmailIcon",
                            "path": "/XI/interviewInvitations",
                            "roles": ["Candidate"],
                            "enabled": true,
                            "locked": true
                        },
                        {
                            "name": "Interviews",
                            "icon": "VideocamIcon",
                            "path": "/XI/jobinterviews",
                            "roles": ["Candidate"],
                            "enabled": true,
                            "locked": false,
                            "count": true
                        },
                        {
                            "name": "Profile",
                            "icon": "PersonIcon",
                            "path": "/XI/profile",
                            "roles": ["Candidate"],
                            "enabled": true,
                            "locked": false,
                            "count": false
                        }
                    ]
                },
                {
                    "label": "Interviewer",
                    "type": "button",
                    "class": "btn btn-primary",
                    "roles": ["Interviewer"],
                    "shortLabel": "XI",
                    "navItems": [
                        {
                            "name": "Dashboard",
                            "icon": "GridViewIcon",
                            "path": "/XI",
                            "roles": ["Interviewer"],
                            "enabled": true
                        },
                        {
                            "name": "Matched Interviews",
                            "icon": "EmailIcon",
                            "path": "/XI/matchedInterviews",//interviewInvitations
                            "roles": ["Interviewer"],
                            "enabled": true
                        },
                        {
                            "name": "Slots",
                            "icon": "VideocamIcon",
                            "path": "/XI/slots",
                            "roles": ["Interviewer"],
                            "enabled": true
                        }
                    ]
                }
            ]
        }
    ]
}

export default XiNavaigationObject;