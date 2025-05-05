const CompanyNavaigationObject = {
    "roles": ["Company"],
    "menu": {
        "navItems": [
            {
                "name": "Dashboard",
                "icon": "GridViewIcon",
                "path": "/company",
                "roles": ["Company"],
                "enabled": true,
                "locked": false
            },
            {
                "name": "Company User",
                "icon": "CompanyUserIcon",
                "roles": ["Company"],
                "enabled": true,
                "locked": false,
                "dropdown": [
                    {
                        "name": "Add User",
                        "icon": "AddUserIcon",
                        "path": "/company/addCompanyUser",
                        "enabled": true
                    },
                    {
                        "name": "Users List",
                        "icon": "UserListIcon",
                        "path": "/company/CompanyUserList",
                        "enabled": true
                    },
                    {
                        "name": "Post a new Job",
                        "icon": "UserListIcon",
                        "path": "/company/jobsAdd",
                        "enabled": true
                    }
                ]
            },
            {
                "name": "Profile",
                "icon": "PersonIcon",
                "path": "/company/profile",
                "roles": ["Candidate"],
                "enabled": true,
                "locked": false,
                "count": false
            },
            {
                "name": "Active Jobs",
                "icon": "ActiveJobs",
                "path": "/company/jobs",
                "roles": ["Candidate"],
                "enabled": true,
                "locked": true,
                "count": false
            },
            {
                "name": "Pending Jobs",
                "icon": "PendingJobs",
                "path": "/company/pendingjobs",
                "roles": ["Candidate"],
                "enabled": true,
                "locked": true,
                "count": false
            },
            {
                "name": "Settings",
                "icon": "Settings",
                "path": "/company/masking",
                "roles": ["Candidate"],
                "enabled": true,
                "locked": false,
                "count": false
            }
        ]
    }
}

export default CompanyNavaigationObject;