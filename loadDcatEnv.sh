#!/usr/bin/env bash
set -e

environment=st2
targetElasticUrl=http://elasticsearch-fellesdatakatalog-${environment}.ose-npc.brreg.no


DATETIME=`date "+%Y-%m-%dT%H_%M_%S"`

echo "Starting dump ${DATETIME}"

# prepare target environment
echo "Delete dcat index"
curl -XDELETE ${targetElasticUrl}/dcat

echo "Create index with mapping"

curl -XPOST ${targetElasticUrl}/dcat -d '{
	"settings": {
		"analysis": {
			"analyzer": {
				"path-analyzer": {
					"type": "custom",
					"tokenizer": "path-tokenizer"
				}
			},
			"tokenizer": {
				"path-tokenizer": {
					"type": "path_hierarchy",
					"delimiter": "/"
				}
			}
		}
	},
	"mappings": {
		"dataset": {
			"properties": {
				"catalog": {
					"properties": {
						"description": {
							"properties": {
								"nb": {
									"type": "string",
									"analyzer": "norwegian",
									"fields": {
										"raw": {
											"type": "string",
											"index": "not_analyzed"
										}
									}
								},
								"nn": {
									"type": "string",
									"analyzer": "norwegian",
									"fields": {
										"raw": {
											"type": "string",
											"index": "not_analyzed"
										}
									}
								},
								"no": {
									"type": "string",
									"analyzer": "norwegian",
									"fields": {
										"raw": {
											"type": "string",
											"index": "not_analyzed"
										}
									}
								},
								"en": {
									"type": "string",
									"analyzer": "english",
									"fields": {
										"raw": {
											"type": "string",
											"index": "not_analyzed"
										}
									}
								}
							}
						},
						"title": {
							"properties": {
								"nb": {
									"type": "string",
									"analyzer": "norwegian",
									"fields": {
										"raw": {
											"type": "string",
											"index": "not_analyzed"
										}
									}
								},
								"nn": {
									"type": "string",
									"analyzer": "norwegian",
									"fields": {
										"raw": {
											"type": "string",
											"index": "not_analyzed"
										}
									}
								},
								"no": {
									"type": "string",
									"analyzer": "norwegian",
									"fields": {
										"raw": {
											"type": "string",
											"index": "not_analyzed"
										}
									}
								},
								"en": {
									"type": "string",
									"analyzer": "english",
									"fields": {
										"raw": {
											"type": "string",
											"index": "not_analyzed"
										}
									}
								}
							}
						}
					}
				},
				"description": {
					"properties": {
						"nb": {
							"type": "string",
							"analyzer": "norwegian",
							"fields": {
								"raw": {
									"type": "string",
									"index": "not_analyzed"
								}
							}
						},
						"nn": {
							"type": "string",
							"analyzer": "norwegian",
							"fields": {
								"raw": {
									"type": "string",
									"index": "not_analyzed"
								}
							}
						},
						"no": {
							"type": "string",
							"analyzer": "norwegian",
							"fields": {
								"raw": {
									"type": "string",
									"index": "not_analyzed"
								}
							}
						},
						"en": {
							"type": "string",
							"analyzer": "english",
							"fields": {
								"raw": {
									"type": "string",
									"index": "not_analyzed"
								}
							}
						}
					}
				},
				"keyword": {
					"properties": {
						"nb": {
							"type": "string",
							"analyzer": "norwegian",
							"fields": {
								"raw": {
									"type": "string",
									"index": "not_analyzed"
								}
							}
						},
						"nn": {
							"type": "string",
							"analyzer": "norwegian",
							"fields": {
								"raw": {
									"type": "string",
									"index": "not_analyzed"
								}
							}
						},
						"no": {
							"type": "string",
							"analyzer": "norwegian",
							"fields": {
								"raw": {
									"type": "string",
									"index": "not_analyzed"
								}
							}
						},
						"en": {
							"type": "string",
							"analyzer": "english",
							"fields": {
								"raw": {
									"type": "string",
									"index": "not_analyzed"
								}
							}
						}
					}
				},
				"title": {
					"properties": {
						"nb": {
							"type": "string",
							"analyzer": "norwegian",
							"fields": {
								"raw": {
									"type": "string",
									"index": "not_analyzed"
								}
							}
						},
						"nn": {
							"type": "string",
							"analyzer": "norwegian",
							"fields": {
								"raw": {
									"type": "string",
									"index": "not_analyzed"
								}
							}
						},
						"no": {
							"type": "string",
							"analyzer": "norwegian",
							"fields": {
								"raw": {
									"type": "string",
									"index": "not_analyzed"
								}
							}
						},
						"en": {
							"type": "string",
							"analyzer": "english",
							"fields": {
								"raw": {
									"type": "string",
									"index": "not_analyzed"
								}
							}
						}
					}
				},
				"theme": {
					"properties": {
						"id": {
							"type": "string",
							"index": "not_analyzed"
						},
						"code": {
							"type": "string",
							"index": "not_analyzed"
						},
						"startUse": {
							"type": "string",
							"index": "not_analyzed"
						},
						"title": {
							"properties": {
								"nb": {
									"type": "string",
									"analyzer": "norwegian",
									"fields": {
										"raw": {
											"type": "string",
											"index": "not_analyzed"
										}
									}
								},
								"nn": {
									"type": "string",
									"analyzer": "norwegian",
									"fields": {
										"raw": {
											"type": "string",
											"index": "not_analyzed"
										}
									}
								},
								"no": {
									"type": "string",
									"analyzer": "norwegian",
									"fields": {
										"raw": {
											"type": "string",
											"index": "not_analyzed"
										}
									}
								},
								"en": {
									"type": "string",
									"analyzer": "english",
									"fields": {
										"raw": {
											"type": "string",
											"index": "not_analyzed"
										}
									}
								}
							}
						},
						"conceptSchema": {
							"properties": {
								"id": {
									"type": "string",
									"index": "not_analyzed"
								},
								"title": {
									"properties": {
										"nb": {
											"type": "string",
											"analyzer": "norwegian",
											"fields": {
												"raw": {
													"type": "string",
													"index": "not_analyzed"
												}
											}
										},
										"nn": {
											"type": "string",
											"analyzer": "norwegian",
											"fields": {
												"raw": {
													"type": "string",
													"index": "not_analyzed"
												}
											}
										},
										"no": {
											"type": "string",
											"analyzer": "norwegian",
											"fields": {
												"raw": {
													"type": "string",
													"index": "not_analyzed"
												}
											}
										},
										"en": {
											"type": "string",
											"analyzer": "english",
											"fields": {
												"raw": {
													"type": "string",
													"index": "not_analyzed"
												}
											}
										}
									}
								},
								"versioninfo": {
									"type": "string",
									"index": "not_analyzed"
								},
								"versionnumber": {
									"type": "string",
									"index": "not_analyzed"
								}
							}
						}
					}
				},
				"publisher": {
					"properties": {
						"name": {
							"type": "string",
							"analyzer": "norwegian",
							"fields": {
								"raw": {
									"type": "string",
									"index": "not_analyzed"
								}
							}
						},
						"orgPath": {
							"type": "string",
							"analyzer": "path-analyzer",
							"search_analyzer": "keyword"
						}
					}
				},
				"accessRights": {
					"properties": {
						"code": {
							"type": "string",
							"analyzer": "norwegian",
							"fields": {
								"raw": {
									"type": "string",
									"index": "not_analyzed"
								}
							}
						}
					}
				},
				"source": {
					"type": "string",
					"analyzer": "norwegian",
					"fields": {
						"raw": {
							"type": "string",
							"index": "not_analyzed"
						}
					}
				}
			}
		},
		"subject": {
			"properties": {
				"altLabel": {
					"properties": {
						"no": {
							"type": "string",
							"analyzer": "norwegian"
						}
					}
				},
				"creator": {
					"properties": {
						"id": {
							"type": "string"
						},
						"naeringskode": {
							"properties": {
								"code": {
									"type": "string"
								},
								"prefLabel": {
									"properties": {
										"no": {
											"type": "string"
										}
									}
								},
								"uri": {
									"type": "string"
								}
							}
						},
						"name": {
							"type": "string",
							"analyzer": "norwegian",
							"fields": {
								"raw": {
									"type": "string",
									"index": "not_analyzed"
								}
							}
						},
						"orgPath": {
							"type": "string",
							"analyzer": "path-analyzer",
							"search_analyzer": "keyword"
						},
						"organisasjonsform": {
							"type": "string"
						},
						"overordnetEnhet": {
							"type": "string"
						},
						"sektorkode": {
							"properties": {
								"code": {
									"type": "string"
								},
								"prefLabel": {
									"properties": {
										"no": {
											"type": "string"
										}
									}
								},
								"uri": {
									"type": "string"
								}
							}
						},
						"uri": {
							"type": "string"
						},
						"valid": {
							"type": "boolean"
						}
					}
				},
				"definition": {
					"properties": {
						"no": {
							"type": "string",
							"analyzer": "norwegian"
						}
					}
				},
				"identifier": {
					"type": "string"
				},
				"inScheme": {
					"type": "string",
					"analyzer": "norwegian",
					"fields": {
						"raw": {
							"type": "string",
							"index": "not_analyzed"
						}
					}
				},
				"note": {
					"properties": {
						"no": {
							"type": "string",
							"analyzer": "norwegian"
						}
					}
				},
				"prefLabel": {
					"properties": {
						"no": {
							"type": "string",
							"analyzer": "norwegian",
							"fields": {
								"raw": {
									"type": "string",
									"index": "not_analyzed"
								}
							}
						}
					}
				}
			}
		}
	}
}
'



# recreate data in target environment
echo "Dump data into target environment"
elasticdump --input=${environment}_dcat_data.json --output=${targetElasticUrl}/dcat --type=data

ENDTIME=`date "+%Y-%m-%dT%H_%M_%S"`

echo "finished dump ${ENDTIME}"

echo "Done";
