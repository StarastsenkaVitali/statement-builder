// ─── Built-in example: RESTORE-FILES ─────────────────────────────────────────
const EXAMPLE_RESTORE_FILES = {
  "stmtName": "RESTORE-FILES",
  "schema": [
    {
      "id": "n14",
      "name": "FILE-NAMES",
      "values": [
        {
          "id": "n1",
          "kind": "keyword",
          "label": "*OWN",
          "description": "Restore all files belonging to the user's own ID."
        },
        {
          "id": "n2",
          "kind": "keyword",
          "label": "*ALL",
          "description": "Restore all files listed in the archive directory."
        },
        {
          "id": "n3",
          "kind": "keyword",
          "label": "*NONE",
          "description": "No files are restored."
        },
        {
          "id": "n4",
          "kind": "keyword",
          "label": "*SELECTED",
          "description": "Path names taken from a list compiled by SELECT-FILE-NAMES."
        },
        {
          "id": "n7",
          "kind": "nested",
          "label": "*FROM-FILE",
          "children": [
            {
              "id": "n6",
              "name": "LIST-FILE-NAME",
              "values": [
                {
                  "id": "n5",
                  "kind": "simple",
                  "simpleType": "<filename 1..54 without-gen-vers>",
                  "description": "Path name of the list file."
                }
              ],
              "description": ""
            }
          ],
          "description": "Path names taken from a SAM list file."
        },
        {
          "id": "n12",
          "kind": "nested",
          "label": "*FROM-LIBRARY-ELEMENT",
          "children": [
            {
              "id": "n9",
              "name": "LIBRARY",
              "values": [
                {
                  "id": "n8",
                  "kind": "simple",
                  "simpleType": "<filename 1..54 without-gen-vers>",
                  "description": "Name of the PLAM library."
                }
              ],
              "description": ""
            },
            {
              "id": "n11",
              "name": "ELEMENT",
              "values": [
                {
                  "id": "n10",
                  "kind": "simple",
                  "simpleType": "<composed-name 1..64 with-under>",
                  "description": "Name of the type-S element. The highest existing version is used."
                }
              ],
              "description": ""
            }
          ],
          "description": "Path names taken from a PLAM library element (type S)."
        },
        {
          "id": "n13",
          "kind": "list",
          "simpleType": "<filename 1..80 without-vers with-wild>",
          "maxItems": 20,
          "description": "Specify path names directly. Up to 20 names; wildcards allowed. Partial filenames (<partial-filename 2..79 with-wild>) also accepted."
        }
      ],
      "description": "Specify the files to be restored. Mandatory operand."
    },
    {
      "id": "n25",
      "name": "EXCEPT-FILE-NAMES",
      "values": [
        {
          "id": "n15",
          "kind": "keyword",
          "label": "*NONE",
          "description": "All files in FILE-NAMES are restored; none excluded."
        },
        {
          "id": "n18",
          "kind": "nested",
          "label": "*FROM-FILE",
          "children": [
            {
              "id": "n17",
              "name": "LIST-FILE-NAME",
              "values": [
                {
                  "id": "n16",
                  "kind": "simple",
                  "simpleType": "<filename 1..54 without-gen-vers>",
                  "description": "Path name of the list file."
                }
              ],
              "description": ""
            }
          ],
          "description": "Exclusion list from a SAM file."
        },
        {
          "id": "n23",
          "kind": "nested",
          "label": "*FROM-LIBRARY-ELEMENT",
          "children": [
            {
              "id": "n20",
              "name": "LIBRARY",
              "values": [
                {
                  "id": "n19",
                  "kind": "simple",
                  "simpleType": "<filename 1..54 without-gen-vers>",
                  "description": "Name of the PLAM library."
                }
              ],
              "description": ""
            },
            {
              "id": "n22",
              "name": "ELEMENT",
              "values": [
                {
                  "id": "n21",
                  "kind": "simple",
                  "simpleType": "<composed-name 1..64 with-under>",
                  "description": "Name of the type-S element. The highest existing version is used."
                }
              ],
              "description": ""
            }
          ],
          "description": "Exclusion list from a PLAM library element."
        },
        {
          "id": "n24",
          "kind": "list",
          "simpleType": "<filename 1..80 without-vers with-wild>",
          "maxItems": 20,
          "description": "Path names to exclude. Up to 20; wildcards allowed. Partial filenames (<partial-filename 2..79 with-wild>) also accepted."
        }
      ],
      "description": "Specify files to be excluded from restoration."
    },
    {
      "id": "n40",
      "name": "NEW-FILE-NAMES",
      "values": [
        {
          "id": "n26",
          "kind": "keyword",
          "label": "*SAME",
          "description": "Restore files under their original names."
        },
        {
          "id": "n39",
          "kind": "nested",
          "label": "*BY-RULE",
          "children": [
            {
              "id": "n29",
              "name": "NEW-CATALOG-ID",
              "values": [
                {
                  "id": "n27",
                  "kind": "keyword",
                  "label": "*SAME",
                  "description": "Keep original catalog ID."
                },
                {
                  "id": "n28",
                  "kind": "simple",
                  "simpleType": "<cat-id>",
                  "description": "New catalog ID (without colon)."
                }
              ],
              "description": "Restore under a different catalog ID."
            },
            {
              "id": "n32",
              "name": "NEW-USER-ID",
              "values": [
                {
                  "id": "n30",
                  "kind": "keyword",
                  "label": "*SAME",
                  "description": "Keep original user ID."
                },
                {
                  "id": "n31",
                  "kind": "simple",
                  "simpleType": "<name 1..8>",
                  "description": "New user ID (without leading $)."
                }
              ],
              "description": "Restore under a different user ID."
            },
            {
              "id": "n35",
              "name": "PREFIX",
              "values": [
                {
                  "id": "n33",
                  "kind": "keyword",
                  "label": "*NONE",
                  "description": "No prefix added."
                },
                {
                  "id": "n34",
                  "kind": "simple",
                  "simpleType": "<filename 1..8 without-cat-user-gen-vers>",
                  "description": "Prefix added to file name (separated by period)."
                }
              ],
              "description": "Add a prefix to the file name."
            },
            {
              "id": "n38",
              "name": "SUFFIX",
              "values": [
                {
                  "id": "n36",
                  "kind": "keyword",
                  "label": "*NONE",
                  "description": "No suffix added."
                },
                {
                  "id": "n37",
                  "kind": "simple",
                  "simpleType": "<composed-name 1..8>",
                  "description": "Suffix added to file name (separated by period)."
                }
              ],
              "description": "Add a suffix to the file name."
            }
          ],
          "description": "Rename files using a common rule."
        }
      ],
      "description": "Rename files before restoring. Format: :cat-id:$user-id.<prefix>.filename.<suffix>"
    },
    {
      "id": "n46",
      "name": "ENVIRONMENT",
      "values": [
        {
          "id": "n41",
          "kind": "keyword",
          "label": "*STD",
          "description": "SF environment for privileged users; user's default pubset for others."
        },
        {
          "id": "n42",
          "kind": "keyword",
          "label": "*SINGLE-FEATURE",
          "description": "SF (Single-Feature) pubset environment."
        },
        {
          "id": "n45",
          "kind": "nested",
          "label": "*SYSTEM-MANAGED",
          "children": [
            {
              "id": "n44",
              "name": "CATALOG-ID",
              "values": [
                {
                  "id": "n43",
                  "kind": "simple",
                  "simpleType": "<cat-id>",
                  "description": "Catalog ID of the SM pubset."
                }
              ],
              "description": "SM pubset catalog ID."
            }
          ],
          "description": "SM pubset environment."
        }
      ],
      "description": "Defines the HSMS environment for this statement."
    },
    {
      "id": "n63",
      "name": "ORIGINAL-SUPPORT",
      "values": [
        {
          "id": "n47",
          "kind": "keyword",
          "label": "*ANY",
          "description": "Restore files regardless of their original volume."
        },
        {
          "id": "n59",
          "kind": "nested",
          "label": "*PUBLIC-DISK",
          "children": [
            {
              "id": "n58",
              "name": "STORAGE-TYPE",
              "values": [
                {
                  "id": "n48",
                  "kind": "keyword",
                  "label": "*ANY",
                  "description": "All storage types; disks and Net-Storage."
                },
                {
                  "id": "n49",
                  "kind": "keyword",
                  "label": "*PUBLIC-SPACE",
                  "description": "Only files from pubset disks."
                },
                {
                  "id": "n57",
                  "kind": "nested",
                  "label": "*NET-STORAGE",
                  "children": [
                    {
                      "id": "n52",
                      "name": "VOLUME",
                      "values": [
                        {
                          "id": "n50",
                          "kind": "keyword",
                          "label": "*ALL",
                          "description": "All Net-Storage volumes."
                        },
                        {
                          "id": "n51",
                          "kind": "list",
                          "simpleType": "<vsn 1..6>",
                          "maxItems": 150,
                          "description": "VSN(s) of Net-Storage volumes."
                        }
                      ],
                      "description": "VSN of Net-Storage volume(s) from which files originate."
                    },
                    {
                      "id": "n56",
                      "name": "FILE-TYPE",
                      "values": [
                        {
                          "id": "n53",
                          "kind": "keyword",
                          "label": "*ANY",
                          "description": "All file types."
                        },
                        {
                          "id": "n54",
                          "kind": "keyword",
                          "label": "*BS2000",
                          "description": "Only BS2000-type Net-Storage files."
                        },
                        {
                          "id": "n55",
                          "kind": "keyword",
                          "label": "*NODE-FILE",
                          "description": "Only node-file-type Net-Storage files."
                        }
                      ],
                      "description": "File type of Net-Storage files to restore."
                    }
                  ],
                  "description": "Only files from Net-Storage."
                }
              ],
              "description": "Select storage type for public volumes."
            }
          ],
          "description": "Restore only files from public volumes."
        },
        {
          "id": "n62",
          "kind": "nested",
          "label": "*PRIVATE-DISK",
          "children": [
            {
              "id": "n61",
              "name": "VOLUMES",
              "values": [
                {
                  "id": "n60",
                  "kind": "list",
                  "simpleType": "<vsn 1..6>",
                  "maxItems": 150,
                  "description": "VSNs of the private disks."
                }
              ],
              "description": "VSNs of private disks."
            }
          ],
          "description": "Restore only files from private disks."
        }
      ],
      "description": "Administrator only. Select files by their original volume. Only valid in SF pubset environment."
    },
    {
      "id": "n101",
      "name": "NEW-SUPPORT",
      "values": [
        {
          "id": "n64",
          "kind": "keyword",
          "label": "*STD",
          "description": "Restore to original volumes; other archive types go to public volumes."
        },
        {
          "id": "n75",
          "kind": "nested",
          "label": "*PUBLIC-DISK",
          "children": [
            {
              "id": "n74",
              "name": "STORAGE-TYPE",
              "values": [
                {
                  "id": "n65",
                  "kind": "keyword",
                  "label": "*STD",
                  "description": "Original medium for public-disk files; public for private-disk files."
                },
                {
                  "id": "n66",
                  "kind": "keyword",
                  "label": "*PUBLIC-SPACE",
                  "description": "Restore only to pubset disks."
                },
                {
                  "id": "n73",
                  "kind": "nested",
                  "label": "*NET-STORAGE",
                  "children": [
                    {
                      "id": "n68",
                      "name": "VOLUME",
                      "values": [
                        {
                          "id": "n67",
                          "kind": "simple",
                          "simpleType": "<vsn 1..6>",
                          "description": "VSN of the Net-Storage volume."
                        }
                      ],
                      "description": "VSN of the Net-Storage volume to write back to."
                    },
                    {
                      "id": "n72",
                      "name": "FILE-TYPE",
                      "values": [
                        {
                          "id": "n69",
                          "kind": "keyword",
                          "label": "*STD",
                          "description": "Restore with original type."
                        },
                        {
                          "id": "n70",
                          "kind": "keyword",
                          "label": "*BS2000",
                          "description": "Restore as BS2000 type."
                        },
                        {
                          "id": "n71",
                          "kind": "keyword",
                          "label": "*NODE-FILE",
                          "description": "Restore as node file type."
                        }
                      ],
                      "description": "File type for Net-Storage restore."
                    }
                  ],
                  "description": "Restore only to Net-Storage."
                }
              ],
              "description": "Storage type for public volumes."
            }
          ],
          "description": "Restore files to public volumes (pubset or Net-Storage)."
        },
        {
          "id": "n81",
          "kind": "nested",
          "label": "*PRIVATE-DISK",
          "children": [
            {
              "id": "n77",
              "name": "VOLUMES",
              "values": [
                {
                  "id": "n76",
                  "kind": "list",
                  "simpleType": "<vsn 1..6>",
                  "maxItems": 150,
                  "description": "VSNs of private disks."
                }
              ],
              "description": "VSNs of private disks."
            },
            {
              "id": "n80",
              "name": "DEVICE-TYPE",
              "values": [
                {
                  "id": "n78",
                  "kind": "keyword",
                  "label": "STDDISK",
                  "description": "Default device type."
                },
                {
                  "id": "n79",
                  "kind": "simple",
                  "simpleType": "<device>",
                  "description": "Specific device type."
                }
              ],
              "description": "Device type of the private disks."
            }
          ],
          "description": "Restore files to private disks."
        },
        {
          "id": "n100",
          "kind": "nested",
          "label": "*SYSTEM-MANAGED-PUBSET",
          "children": [
            {
              "id": "n89",
              "name": "STORAGE-CLASS",
              "values": [
                {
                  "id": "n82",
                  "kind": "keyword",
                  "label": "*ORIGINAL",
                  "description": "Original storage class (SF files: no storage class)."
                },
                {
                  "id": "n83",
                  "kind": "keyword",
                  "label": "*STD",
                  "description": "Default storage class for the user."
                },
                {
                  "id": "n88",
                  "kind": "nested",
                  "label": "*NONE",
                  "children": [
                    {
                      "id": "n87",
                      "name": "VOLUME-SET-ID",
                      "values": [
                        {
                          "id": "n84",
                          "kind": "keyword",
                          "label": "*BEST-VOLUME-SET",
                          "description": "Volume set best matching file attributes."
                        },
                        {
                          "id": "n85",
                          "kind": "keyword",
                          "label": "*ORIGINAL",
                          "description": "Original volume set (requires physical allocation privilege)."
                        },
                        {
                          "id": "n86",
                          "kind": "simple",
                          "simpleType": "<cat-id>",
                          "description": "Catalog ID of a specific volume set."
                        }
                      ],
                      "description": "Volume set for restored files."
                    }
                  ],
                  "description": "No storage class assigned."
                }
              ],
              "description": "Storage class for SM pubset restore."
            },
            {
              "id": "n99",
              "name": "STORAGE-TYPE",
              "values": [
                {
                  "id": "n90",
                  "kind": "keyword",
                  "label": "*STD",
                  "description": "Restore to public volumes."
                },
                {
                  "id": "n91",
                  "kind": "keyword",
                  "label": "*PUBLIC-SPACE",
                  "description": "Only pubset disks."
                },
                {
                  "id": "n98",
                  "kind": "nested",
                  "label": "*NET-STORAGE",
                  "children": [
                    {
                      "id": "n93",
                      "name": "VOLUME",
                      "values": [
                        {
                          "id": "n92",
                          "kind": "simple",
                          "simpleType": "<vsn 1..6>",
                          "description": "VSN of the Net-Storage volume."
                        }
                      ],
                      "description": "VSN of the Net-Storage volume to write back to."
                    },
                    {
                      "id": "n97",
                      "name": "FILE-TYPE",
                      "values": [
                        {
                          "id": "n94",
                          "kind": "keyword",
                          "label": "*STD",
                          "description": "Restore with original type."
                        },
                        {
                          "id": "n95",
                          "kind": "keyword",
                          "label": "*BS2000",
                          "description": "Restore as BS2000 type."
                        },
                        {
                          "id": "n96",
                          "kind": "keyword",
                          "label": "*NODE-FILE",
                          "description": "Restore as node file type."
                        }
                      ],
                      "description": "File type for Net-Storage restore."
                    }
                  ],
                  "description": "Only to assigned Net-Storage."
                }
              ],
              "description": "Storage type for SM pubset."
            }
          ],
          "description": "Restore files to an SM pubset."
        }
      ],
      "description": "Define the target volumes for restored files."
    },
    {
      "id": "n104",
      "name": "MIGRATED-FILES",
      "values": [
        {
          "id": "n102",
          "kind": "keyword",
          "label": "*DATA-AND-CATALOG",
          "description": "Restore migrated files with data to S0."
        },
        {
          "id": "n103",
          "kind": "keyword",
          "label": "*CATALOG-ONLY",
          "description": "Restore only catalog entries; data stays in migration archive."
        }
      ],
      "description": "Administrator only. Restore procedure for migrated files."
    },
    {
      "id": "n107",
      "name": "NET-STORAGE-FILES",
      "values": [
        {
          "id": "n105",
          "kind": "keyword",
          "label": "*DATA-AND-CATALOG",
          "description": "Restore data and catalog entry for Net-Storage files."
        },
        {
          "id": "n106",
          "kind": "keyword",
          "label": "*CATALOG-ONLY",
          "description": "Restore only the catalog entry."
        }
      ],
      "description": "Specifies whether to restore data or only the catalog entry for Net-Storage (BS2000 type, NETSTOR) files."
    },
    {
      "id": "n121",
      "name": "JV-NAMES",
      "values": [
        {
          "id": "n108",
          "kind": "keyword",
          "label": "*NONE",
          "description": "No job variables are restored."
        },
        {
          "id": "n109",
          "kind": "keyword",
          "label": "*OWN",
          "description": "All job variables of the user's own ID."
        },
        {
          "id": "n110",
          "kind": "keyword",
          "label": "*ALL",
          "description": "All job variables on any imported pubset."
        },
        {
          "id": "n111",
          "kind": "keyword",
          "label": "*SELECTED",
          "description": "Path names from a SELECT-JV-NAMES list."
        },
        {
          "id": "n114",
          "kind": "nested",
          "label": "*FROM-FILE",
          "children": [
            {
              "id": "n113",
              "name": "LIST-FILE-NAME",
              "values": [
                {
                  "id": "n112",
                  "kind": "simple",
                  "simpleType": "<filename 1..54 without-gen-vers>",
                  "description": "Path name of the list file."
                }
              ],
              "description": ""
            }
          ],
          "description": "JV path names from a SAM list file."
        },
        {
          "id": "n119",
          "kind": "nested",
          "label": "*FROM-LIBRARY-ELEMENT",
          "children": [
            {
              "id": "n116",
              "name": "LIBRARY",
              "values": [
                {
                  "id": "n115",
                  "kind": "simple",
                  "simpleType": "<filename 1..54 without-gen-vers>",
                  "description": "Name of the PLAM library."
                }
              ],
              "description": ""
            },
            {
              "id": "n118",
              "name": "ELEMENT",
              "values": [
                {
                  "id": "n117",
                  "kind": "simple",
                  "simpleType": "<composed-name 1..64 with-under>",
                  "description": "Name of the type-S element. The highest existing version is used."
                }
              ],
              "description": ""
            }
          ],
          "description": "JV path names from a PLAM library element."
        },
        {
          "id": "n120",
          "kind": "list",
          "simpleType": "<filename 1..80 without-gen-vers with-wild>",
          "maxItems": 20,
          "description": "JV path names specified directly. Up to 20; wildcards allowed. Partial filenames (<partial-filename 2..79 with-wild>) also accepted."
        }
      ],
      "description": "Specify the job variables to be restored. Not supported in version backup archives."
    },
    {
      "id": "n132",
      "name": "EXCEPT-JV-NAMES",
      "values": [
        {
          "id": "n122",
          "kind": "keyword",
          "label": "*NONE",
          "description": "All JVs in JV-NAMES are restored."
        },
        {
          "id": "n125",
          "kind": "nested",
          "label": "*FROM-FILE",
          "children": [
            {
              "id": "n124",
              "name": "LIST-FILE-NAME",
              "values": [
                {
                  "id": "n123",
                  "kind": "simple",
                  "simpleType": "<filename 1..54 without-gen-vers>",
                  "description": "Path name of the list file."
                }
              ],
              "description": ""
            }
          ],
          "description": "Exclusion list from a SAM file."
        },
        {
          "id": "n130",
          "kind": "nested",
          "label": "*FROM-LIBRARY-ELEMENT",
          "children": [
            {
              "id": "n127",
              "name": "LIBRARY",
              "values": [
                {
                  "id": "n126",
                  "kind": "simple",
                  "simpleType": "<filename 1..54 without-gen-vers>",
                  "description": "Name of the PLAM library."
                }
              ],
              "description": ""
            },
            {
              "id": "n129",
              "name": "ELEMENT",
              "values": [
                {
                  "id": "n128",
                  "kind": "simple",
                  "simpleType": "<composed-name 1..64 with-under>",
                  "description": "Name of the type-S element. The highest existing version is used."
                }
              ],
              "description": ""
            }
          ],
          "description": "Exclusion list from a PLAM library element."
        },
        {
          "id": "n131",
          "kind": "list",
          "simpleType": "<filename 1..80 without-gen-vers with-wild>",
          "maxItems": 20,
          "description": "JV names to exclude. Up to 20; wildcards allowed."
        }
      ],
      "description": "Specify job variables to exclude from restoration."
    },
    {
      "id": "n147",
      "name": "NEW-JV-NAMES",
      "values": [
        {
          "id": "n133",
          "kind": "keyword",
          "label": "*SAME",
          "description": "Restore job variables under their original names."
        },
        {
          "id": "n146",
          "kind": "nested",
          "label": "*BY-RULE",
          "children": [
            {
              "id": "n136",
              "name": "NEW-CATALOG-ID",
              "values": [
                {
                  "id": "n134",
                  "kind": "keyword",
                  "label": "*SAME",
                  "description": ""
                },
                {
                  "id": "n135",
                  "kind": "simple",
                  "simpleType": "<cat-id>",
                  "description": ""
                }
              ],
              "description": "New catalog ID for job variables."
            },
            {
              "id": "n139",
              "name": "NEW-USER-ID",
              "values": [
                {
                  "id": "n137",
                  "kind": "keyword",
                  "label": "*SAME",
                  "description": ""
                },
                {
                  "id": "n138",
                  "kind": "simple",
                  "simpleType": "<name 1..8>",
                  "description": ""
                }
              ],
              "description": "New user ID for job variables."
            },
            {
              "id": "n142",
              "name": "PREFIX",
              "values": [
                {
                  "id": "n140",
                  "kind": "keyword",
                  "label": "*NONE",
                  "description": ""
                },
                {
                  "id": "n141",
                  "kind": "simple",
                  "simpleType": "<name 1..8>",
                  "description": ""
                }
              ],
              "description": "Prefix for JV names."
            },
            {
              "id": "n145",
              "name": "SUFFIX",
              "values": [
                {
                  "id": "n143",
                  "kind": "keyword",
                  "label": "*NONE",
                  "description": ""
                },
                {
                  "id": "n144",
                  "kind": "simple",
                  "simpleType": "<composed-name 1..8>",
                  "description": ""
                }
              ],
              "description": "Suffix for JV names."
            }
          ],
          "description": "Rename job variables using a common rule."
        }
      ],
      "description": "Rename job variables before restoring."
    },
    {
      "id": "n150",
      "name": "RELEASE-UNUSED-SPACE",
      "values": [
        {
          "id": "n148",
          "kind": "keyword",
          "label": "*NO",
          "description": "Keep unused storage space after restore."
        },
        {
          "id": "n149",
          "kind": "keyword",
          "label": "*YES",
          "description": "Release unused storage space (between last-page pointer and file size)."
        }
      ],
      "description": "Determines whether unused storage space is released after file restoration."
    },
    {
      "id": "n154",
      "name": "FILE-CONVERSION",
      "values": [
        {
          "id": "n151",
          "kind": "keyword",
          "label": "*STD",
          "description": "Convert PAM-key files to NK format when restoring to NK disk."
        },
        {
          "id": "n152",
          "kind": "keyword",
          "label": "*NO",
          "description": "Do not convert files with PAM keys; such files will not be restored."
        },
        {
          "id": "n153",
          "kind": "keyword",
          "label": "*CONV-FORMAT",
          "description": "Convert PAM-key files to CONV format on NK disk."
        }
      ],
      "description": "Whether files with PAM key format different from output volume are converted on restore. Ignored for JVs."
    },
    {
      "id": "n157",
      "name": "DATE-AND-PROTECTION",
      "values": [
        {
          "id": "n155",
          "kind": "keyword",
          "label": "*STD-ATTRIBUTES",
          "description": "Set date and protection attributes to defaults."
        },
        {
          "id": "n156",
          "kind": "keyword",
          "label": "*ORIGINAL-ATTRIBUTES",
          "description": "Adopt date and protection attributes from the backed-up settings."
        }
      ],
      "description": "Only evaluated when restoring from long-term archives. Controls date/protection attributes for renamed files."
    },
    {
      "id": "n171",
      "name": "REPLACE-FILES-AND-JV",
      "values": [
        {
          "id": "n158",
          "kind": "keyword",
          "label": "*NO",
          "description": "Do not overwrite existing files and JVs."
        },
        {
          "id": "n170",
          "kind": "nested",
          "label": "*YES",
          "children": [
            {
              "id": "n162",
              "name": "PROTECTION-RESPECTED",
              "values": [
                {
                  "id": "n159",
                  "kind": "keyword",
                  "label": "*ALL",
                  "description": "Only overwrite files not protected by password, with write access, and expired retention."
                },
                {
                  "id": "n160",
                  "kind": "keyword",
                  "label": "*PASSWORDS",
                  "description": "Only overwrite files not protected by a password."
                },
                {
                  "id": "n161",
                  "kind": "keyword",
                  "label": "*NONE",
                  "description": "Overwrite all files regardless of protection. Administrator only."
                }
              ],
              "description": "How much file protection is respected during overwrite."
            },
            {
              "id": "n165",
              "name": "REORGANIZE-SPACE",
              "values": [
                {
                  "id": "n163",
                  "kind": "keyword",
                  "label": "*YES",
                  "description": "Erase existing files before restore (reorganizes space)."
                },
                {
                  "id": "n164",
                  "kind": "keyword",
                  "label": "*NO",
                  "description": "Keep existing extents; no reorganization."
                }
              ],
              "description": "Whether to erase existing file extents before restore."
            },
            {
              "id": "n169",
              "name": "PASSWORDS",
              "values": [
                {
                  "id": "n166",
                  "kind": "keyword",
                  "label": "*NONE",
                  "description": "No passwords specified."
                },
                {
                  "id": "n167",
                  "kind": "keyword",
                  "label": "*SECRET-PROMPT",
                  "description": "Concealed password input in interactive mode."
                },
                {
                  "id": "n168",
                  "kind": "list",
                  "simpleType": "<c-string 1..4>",
                  "maxItems": 63,
                  "description": "Password list up to 63 entries. Each entry may be <c-string 1..4>, <x-string 1..8>, or <integer -2147483648..2147483647>."
                }
              ],
              "description": "Passwords for protected files/JVs or protected save file. Not required for HSMS administrators."
            }
          ],
          "description": "Existing files and JVs are overwritten."
        }
      ],
      "description": "Determines whether existing files and job variables are overwritten during restore."
    },
    {
      "id": "n177",
      "name": "ARCHIVE-NAME",
      "values": [
        {
          "id": "n172",
          "kind": "keyword",
          "label": "*SYSBACKUP",
          "description": "Default system backup archive in the specified environment."
        },
        {
          "id": "n173",
          "kind": "keyword",
          "label": "*SYSARCHIVE",
          "description": "Default long-term system archive."
        },
        {
          "id": "n174",
          "kind": "keyword",
          "label": "*SYSMIGRATE",
          "description": "Default system migration archive."
        },
        {
          "id": "n175",
          "kind": "keyword",
          "label": "*SYSVERSION",
          "description": "System version backup archive assigned to the pubset in FILE-NAMES."
        },
        {
          "id": "n176",
          "kind": "simple",
          "simpleType": "<filename 1..22 without-cat-gen-vers>",
          "description": "Name of a specific archive."
        }
      ],
      "description": "Name of the archive from which files/JVs are restored. Shadow archives must be named explicitly."
    },
    {
      "id": "n229",
      "name": "SELECT-SAVE-VERSIONS",
      "values": [
        {
          "id": "n178",
          "kind": "keyword",
          "label": "*STD",
          "description": "For backup/archival: same as *ALL. For version backup: most recent file version by original date."
        },
        {
          "id": "n179",
          "kind": "keyword",
          "label": "*ALL",
          "description": "Select all save versions; restore from most recent version containing each file."
        },
        {
          "id": "n187",
          "kind": "nested",
          "label": "*LATEST",
          "children": [
            {
              "id": "n182",
              "name": "DAY-INTERVAL",
              "values": [
                {
                  "id": "n180",
                  "kind": "keyword",
                  "label": "*NO",
                  "description": "Only the single latest save version."
                },
                {
                  "id": "n181",
                  "kind": "keyword",
                  "label": "*YES",
                  "description": "Extend to all save versions created on the same day as the latest."
                }
              ],
              "description": "Whether to extend 'latest' to cover the same day."
            },
            {
              "id": "n186",
              "name": "CREATED-AFTER",
              "values": [
                {
                  "id": "n183",
                  "kind": "keyword",
                  "label": "*EARLIEST-DATE",
                  "description": "No lower date limit on save version creation."
                },
                {
                  "id": "n184",
                  "kind": "simple",
                  "simpleType": "<date with-compl>",
                  "description": "Only consider save versions created on or after this date."
                },
                {
                  "id": "n185",
                  "kind": "simple",
                  "simpleType": "<integer -99999..0 days>",
                  "description": "Relative date: days relative to current date."
                }
              ],
              "description": "Lower date limit for save version selection."
            }
          ],
          "description": "Only the most recently created save version is used."
        },
        {
          "id": "n228",
          "kind": "nested",
          "label": "*BY-ATTRIBUTES",
          "children": [
            {
              "id": "n190",
              "name": "SAVE-VERSION-NAME",
              "values": [
                {
                  "id": "n188",
                  "kind": "keyword",
                  "label": "*ANY",
                  "description": "Select regardless of save version name."
                },
                {
                  "id": "n189",
                  "kind": "simple",
                  "simpleType": "<name 1..8>",
                  "description": "Select only save versions with this name."
                }
              ],
              "description": "Select save version by name assigned at creation."
            },
            {
              "id": "n227",
              "name": "SAVE-VERSION-DATE",
              "values": [
                {
                  "id": "n191",
                  "kind": "keyword",
                  "label": "*LATEST",
                  "description": "Only the most recently created save version."
                },
                {
                  "id": "n195",
                  "kind": "nested",
                  "label": "<date with-compl>",
                  "children": [
                    {
                      "id": "n194",
                      "name": "TIME",
                      "values": [
                        {
                          "id": "n192",
                          "kind": "keyword",
                          "label": "23:59:59",
                          "description": "End of day."
                        },
                        {
                          "id": "n193",
                          "kind": "simple",
                          "simpleType": "<time>",
                          "description": "Specific time hh:mm:ss."
                        }
                      ],
                      "description": "Time component for date selection."
                    }
                  ],
                  "description": "Last save version created on or before this date."
                },
                {
                  "id": "n210",
                  "kind": "nested",
                  "label": "*INTERVAL",
                  "children": [
                    {
                      "id": "n205",
                      "name": "CREATED-BEFORE",
                      "values": [
                        {
                          "id": "n196",
                          "kind": "keyword",
                          "label": "*LATEST-DATE",
                          "description": "No upper date limit."
                        },
                        {
                          "id": "n200",
                          "kind": "nested",
                          "label": "<date with-compl>",
                          "children": [
                            {
                              "id": "n199",
                              "name": "TIME",
                              "values": [
                                {
                                  "id": "n197",
                                  "kind": "keyword",
                                  "label": "23:59:59",
                                  "description": ""
                                },
                                {
                                  "id": "n198",
                                  "kind": "simple",
                                  "simpleType": "<time>",
                                  "description": ""
                                }
                              ],
                              "description": "Time component."
                            }
                          ],
                          "description": "Absolute upper date limit."
                        },
                        {
                          "id": "n204",
                          "kind": "nested",
                          "label": "<integer -99999..0 days>",
                          "children": [
                            {
                              "id": "n203",
                              "name": "TIME",
                              "values": [
                                {
                                  "id": "n201",
                                  "kind": "keyword",
                                  "label": "23:59:59",
                                  "description": ""
                                },
                                {
                                  "id": "n202",
                                  "kind": "simple",
                                  "simpleType": "<time>",
                                  "description": ""
                                }
                              ],
                              "description": "Time component."
                            }
                          ],
                          "description": "Relative upper date limit."
                        }
                      ],
                      "description": "Upper limit of the save version creation date interval."
                    },
                    {
                      "id": "n209",
                      "name": "CREATED-AFTER",
                      "values": [
                        {
                          "id": "n206",
                          "kind": "keyword",
                          "label": "*EARLIEST-DATE",
                          "description": "No lower date limit."
                        },
                        {
                          "id": "n207",
                          "kind": "simple",
                          "simpleType": "<date with-compl>",
                          "description": "Absolute lower date limit."
                        },
                        {
                          "id": "n208",
                          "kind": "simple",
                          "simpleType": "<integer -99999..0 days>",
                          "description": "Relative lower date limit."
                        }
                      ],
                      "description": "Lower limit of the save version creation date interval."
                    }
                  ],
                  "description": "Select save versions within a creation date interval."
                },
                {
                  "id": "n226",
                  "kind": "nested",
                  "label": "*BY-ORIGINAL-DATE",
                  "children": [
                    {
                      "id": "n220",
                      "name": "CREATED-BEFORE",
                      "values": [
                        {
                          "id": "n211",
                          "kind": "keyword",
                          "label": "*LATEST-DATE",
                          "description": "No upper limit on original creation date."
                        },
                        {
                          "id": "n215",
                          "kind": "nested",
                          "label": "<date with-compl>",
                          "children": [
                            {
                              "id": "n214",
                              "name": "TIME",
                              "values": [
                                {
                                  "id": "n212",
                                  "kind": "keyword",
                                  "label": "23:59:59",
                                  "description": ""
                                },
                                {
                                  "id": "n213",
                                  "kind": "simple",
                                  "simpleType": "<time>",
                                  "description": ""
                                }
                              ],
                              "description": "Time component."
                            }
                          ],
                          "description": "Absolute upper date limit (original creation date)."
                        },
                        {
                          "id": "n219",
                          "kind": "nested",
                          "label": "<integer -99999..0 days>",
                          "children": [
                            {
                              "id": "n218",
                              "name": "TIME",
                              "values": [
                                {
                                  "id": "n216",
                                  "kind": "keyword",
                                  "label": "23:59:59",
                                  "description": ""
                                },
                                {
                                  "id": "n217",
                                  "kind": "simple",
                                  "simpleType": "<time>",
                                  "description": ""
                                }
                              ],
                              "description": "Time component."
                            }
                          ],
                          "description": "Relative upper date limit (original creation date)."
                        }
                      ],
                      "description": "Upper limit on original backup creation date."
                    },
                    {
                      "id": "n225",
                      "name": "CREATED-AFTER",
                      "values": [
                        {
                          "id": "n221",
                          "kind": "keyword",
                          "label": "*EARLIEST-DATE",
                          "description": "No lower limit on original creation date."
                        },
                        {
                          "id": "n222",
                          "kind": "keyword",
                          "label": "*SAME-AS-BEFORE",
                          "description": "Only the version whose original date equals CREATED-BEFORE."
                        },
                        {
                          "id": "n223",
                          "kind": "simple",
                          "simpleType": "<date with-compl>",
                          "description": "Absolute lower date limit."
                        },
                        {
                          "id": "n224",
                          "kind": "simple",
                          "simpleType": "<integer -99999..0 days>",
                          "description": "Relative lower date limit."
                        }
                      ],
                      "description": "Lower limit on original backup creation date."
                    }
                  ],
                  "description": "Select by original creation date (for migration, long-term, and version backup archives)."
                }
              ],
              "description": "Select save version by its creation date."
            }
          ],
          "description": "Select save version by attributes (name and/or date)."
        }
      ],
      "description": "Defines the save versions to be used for restoration."
    },
    {
      "id": "n232",
      "name": "DEVICE-TYPE",
      "values": [
        {
          "id": "n230",
          "kind": "keyword",
          "label": "*STD",
          "description": "Use preset value from archive definition."
        },
        {
          "id": "n231",
          "kind": "simple",
          "simpleType": "<device>",
          "description": "Device type of the volume containing the save version."
        }
      ],
      "description": "Device type of tape volume. Only needed for ARCHIVE < V2.6B; later versions read it from directory."
    },
    {
      "id": "n239",
      "name": "DIALOG-FILE-SELECT",
      "values": [
        {
          "id": "n233",
          "kind": "keyword",
          "label": "*NO",
          "description": "No interactive file selection dialog."
        },
        {
          "id": "n238",
          "kind": "nested",
          "label": "*YES",
          "children": [
            {
              "id": "n237",
              "name": "SHOW-FILE-VERSIONS",
              "values": [
                {
                  "id": "n234",
                  "kind": "keyword",
                  "label": "*LATEST",
                  "description": "Show only the most recent save version of each file."
                },
                {
                  "id": "n235",
                  "kind": "keyword",
                  "label": "*DIFFERENT",
                  "description": "Show only save versions where file was actually modified."
                },
                {
                  "id": "n236",
                  "kind": "keyword",
                  "label": "*ALL",
                  "description": "Show all save versions of each file."
                }
              ],
              "description": "How many save versions of each file to display."
            }
          ],
          "description": "Show a screen mask to interactively select files for restore."
        }
      ],
      "description": "Interactive file selection dialog. Evaluated in interactive mode only; ignored in batch."
    },
    {
      "id": "n245",
      "name": "DIALOG-JV-SELECT",
      "values": [
        {
          "id": "n240",
          "kind": "keyword",
          "label": "*NO",
          "description": "No interactive JV selection dialog."
        },
        {
          "id": "n244",
          "kind": "nested",
          "label": "*YES",
          "children": [
            {
              "id": "n243",
              "name": "SHOW-JV-VERSIONS",
              "values": [
                {
                  "id": "n241",
                  "kind": "keyword",
                  "label": "*LATEST",
                  "description": "Output JVs from latest save versions only."
                },
                {
                  "id": "n242",
                  "kind": "keyword",
                  "label": "*ALL",
                  "description": "Output all save versions of each JV."
                }
              ],
              "description": "How many save versions of each JV to display."
            }
          ],
          "description": "Show a screen mask to interactively select job variables for restore."
        }
      ],
      "description": "Interactive job variable selection dialog. Evaluated in interactive mode only; ignored in batch."
    },
    {
      "id": "n303",
      "name": "OPERATION-CONTROL",
      "values": [
        {
          "id": "n246",
          "kind": "keyword",
          "label": "*STD",
          "description": "Use default values for all operational parameters."
        },
        {
          "id": "n302",
          "kind": "nested",
          "label": "*PARAMETERS",
          "children": [
            {
              "id": "n249",
              "name": "REQUEST-NAME",
              "values": [
                {
                  "id": "n247",
                  "kind": "keyword",
                  "label": "*STD",
                  "description": "Auto-generated: RSF#<TSN>."
                },
                {
                  "id": "n248",
                  "kind": "simple",
                  "simpleType": "<name 1..8>",
                  "description": "Custom request name (extended internally with user ID prefix and timestamp)."
                }
              ],
              "description": "Request name for use in HSMS management statements."
            },
            {
              "id": "n252",
              "name": "REQUEST-DESCRIPTOR",
              "values": [
                {
                  "id": "n250",
                  "kind": "keyword",
                  "label": "*NONE",
                  "description": "No descriptor text."
                },
                {
                  "id": "n251",
                  "kind": "simple",
                  "simpleType": "<text 1..60>",
                  "description": "Descriptive text displayed at operator console when request starts."
                }
              ],
              "description": "Optional text describing the request."
            },
            {
              "id": "n255",
              "name": "EXPRESS-REQUEST",
              "values": [
                {
                  "id": "n253",
                  "kind": "keyword",
                  "label": "*NO",
                  "description": "Normal tape access sessions."
                },
                {
                  "id": "n254",
                  "kind": "keyword",
                  "label": "*YES",
                  "description": "Use sessions defined for express requests. Administrator only."
                }
              ],
              "description": "Administrator only. Whether to use express request tape sessions."
            },
            {
              "id": "n258",
              "name": "CONTROL-JV",
              "values": [
                {
                  "id": "n256",
                  "kind": "keyword",
                  "label": "*NONE",
                  "description": "No control job variable."
                },
                {
                  "id": "n257",
                  "kind": "simple",
                  "simpleType": "<filename 1..54 without-gen-vers>",
                  "description": "Name of JV for HSMS to update with processing status."
                }
              ],
              "description": "Job variable that HSMS updates with important action status values."
            },
            {
              "id": "n261",
              "name": "WAIT-FOR-COMPLETION",
              "values": [
                {
                  "id": "n259",
                  "kind": "keyword",
                  "label": "*NO",
                  "description": "Asynchronous: control returns after statement validation."
                },
                {
                  "id": "n260",
                  "kind": "keyword",
                  "label": "*YES",
                  "description": "Synchronous: wait until processing completes."
                }
              ],
              "description": "Synchronous or asynchronous request processing."
            },
            {
              "id": "n264",
              "name": "PARALLEL-RUNS",
              "values": [
                {
                  "id": "n262",
                  "kind": "keyword",
                  "label": "*STD",
                  "description": "Use preset value from archive definition."
                },
                {
                  "id": "n263",
                  "kind": "simple",
                  "simpleType": "<integer 1..16>",
                  "description": "Number of parallel ARCHIVE subtasks (for S2 storage level)."
                }
              ],
              "description": "Number of parallel save tasks. Requires 2 tape devices per task."
            },
            {
              "id": "n268",
              "name": "WRITE-CHECKPOINTS",
              "values": [
                {
                  "id": "n265",
                  "kind": "keyword",
                  "label": "*STD",
                  "description": "Use preset value from archive definition."
                },
                {
                  "id": "n266",
                  "kind": "keyword",
                  "label": "*YES",
                  "description": "Write checkpoints to ARCHIVE checkpoint file (enables restart)."
                },
                {
                  "id": "n267",
                  "kind": "keyword",
                  "label": "*NO",
                  "description": "Do not write checkpoints."
                }
              ],
              "description": "Administrator only. Whether to write checkpoints to enable restart after interruption."
            },
            {
              "id": "n272",
              "name": "OPERATOR-INTERACTION",
              "values": [
                {
                  "id": "n269",
                  "kind": "keyword",
                  "label": "*STD",
                  "description": "Use preset value from archive definition."
                },
                {
                  "id": "n270",
                  "kind": "keyword",
                  "label": "*NOT-ALLOWED",
                  "description": "No console messages requiring operator response; HSMS uses defaults."
                },
                {
                  "id": "n271",
                  "kind": "keyword",
                  "label": "*ALLOWED",
                  "description": "Console messages requiring operator response are output."
                }
              ],
              "description": "Administrator only. Whether operator-response messages appear at console."
            },
            {
              "id": "n279",
              "name": "TAPE-CONTROL",
              "values": [
                {
                  "id": "n273",
                  "kind": "keyword",
                  "label": "*STD",
                  "description": "Use preset values from archive definition."
                },
                {
                  "id": "n278",
                  "kind": "nested",
                  "label": "*PARAMETERS",
                  "children": [
                    {
                      "id": "n277",
                      "name": "UNLOAD-TAPE",
                      "values": [
                        {
                          "id": "n274",
                          "kind": "keyword",
                          "label": "*STD",
                          "description": "Use preset value from archive definition."
                        },
                        {
                          "id": "n275",
                          "kind": "keyword",
                          "label": "*YES",
                          "description": "Unload tapes after processing."
                        },
                        {
                          "id": "n276",
                          "kind": "keyword",
                          "label": "*NO",
                          "description": "Do not unload tapes after processing."
                        }
                      ],
                      "description": "Whether tapes are unloaded after processing."
                    }
                  ],
                  "description": "Specify tape control parameters explicitly."
                }
              ],
              "description": "Administrator only. Parameters for restoring from tape."
            },
            {
              "id": "n285",
              "name": "PERFORMANCE-ANALYSIS",
              "values": [
                {
                  "id": "n280",
                  "kind": "keyword",
                  "label": "*NO",
                  "description": "No statistics file produced."
                },
                {
                  "id": "n284",
                  "kind": "nested",
                  "label": "*YES",
                  "children": [
                    {
                      "id": "n283",
                      "name": "SEPARATOR",
                      "values": [
                        {
                          "id": "n281",
                          "kind": "keyword",
                          "label": ";",
                          "description": "Default separator (Excel default)."
                        },
                        {
                          "id": "n282",
                          "kind": "simple",
                          "simpleType": "<c-string 1..1>",
                          "description": "Custom field separator character."
                        }
                      ],
                      "description": "Field separator in statistics file."
                    }
                  ],
                  "description": "Produce a statistics file for each ARCHIVE subtask."
                }
              ],
              "description": "Whether to produce per-subtask statistics files during restore."
            },
            {
              "id": "n290",
              "name": "REPORT",
              "values": [
                {
                  "id": "n286",
                  "kind": "keyword",
                  "label": "*SUMMARY",
                  "description": "Summary of results including error messages."
                },
                {
                  "id": "n287",
                  "kind": "keyword",
                  "label": "*RESTORED-FILES",
                  "description": "Summary plus list of all actually restored files."
                },
                {
                  "id": "n288",
                  "kind": "keyword",
                  "label": "*FULL",
                  "description": "Full report including files that should have been but were not restored."
                },
                {
                  "id": "n289",
                  "kind": "keyword",
                  "label": "*NONE",
                  "description": "No report output."
                }
              ],
              "description": "Scope of the restore report."
            },
            {
              "id": "n301",
              "name": "OUTPUT",
              "values": [
                {
                  "id": "n291",
                  "kind": "keyword",
                  "label": "*STD",
                  "description": "Output destination from global HSMS parameter OUTPUT."
                },
                {
                  "id": "n292",
                  "kind": "keyword",
                  "label": "*PRINTER",
                  "description": "Print the report."
                },
                {
                  "id": "n293",
                  "kind": "keyword",
                  "label": "*NONE",
                  "description": "No report output (but pdf available via SE Manager Backup Monitoring if activated)."
                },
                {
                  "id": "n294",
                  "kind": "keyword",
                  "label": "*MAIL",
                  "description": "Send report as email attachment to caller's address."
                },
                {
                  "id": "n299",
                  "kind": "nested",
                  "label": "*LIBRARY-ELEMENT",
                  "children": [
                    {
                      "id": "n296",
                      "name": "LIBRARY",
                      "values": [
                        {
                          "id": "n295",
                          "kind": "simple",
                          "simpleType": "<filename 1..54 without-gen-vers>",
                          "description": "PLAM library name."
                        }
                      ],
                      "description": "PLAM library."
                    },
                    {
                      "id": "n298",
                      "name": "ELEMENT",
                      "values": [
                        {
                          "id": "n297",
                          "kind": "simple",
                          "simpleType": "<composed-name 1..64 with-under>",
                          "description": "Type-P element; version = user ID + date/time."
                        }
                      ],
                      "description": "PLAM element name."
                    }
                  ],
                  "description": "Write report to a PLAM library element (type P)."
                },
                {
                  "id": "n300",
                  "kind": "simple",
                  "simpleType": "<filename 1..54 without-gen-vers>",
                  "description": "Write report to specified file. SAM file: appended; otherwise printed."
                }
              ],
              "description": "Where to output the restore report."
            }
          ],
          "description": "Specify operational control parameters for the restore run."
        }
      ],
      "description": "Enables definition of parameters relevant for execution of the restore run."
    }
  ],
  "selections": {}
}

function loadExample() {
  pushHistory();
  const data = JSON.parse(JSON.stringify(EXAMPLE_RESTORE_FILES)); // deep clone
  schema = data.schema;
  selections = data.selections || {};
  document.getElementById('stmtName').value = data.stmtName;
  bumpIdCounterFromSchema(schema);
  bCollapsed = {}; fCollapsed = {};
  collapseAll(schema);
  renderAll();
}