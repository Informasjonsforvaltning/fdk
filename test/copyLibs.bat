del lib /Q
mkdir lib

copy ..\portal\query\target\query*.jar lib
copy ..\portal\webapp\target\webapp*.jar lib
copy ..\harvester\target\harvester*.jar lib
copy ..\datastore\target\datastore*.jar lib

copy target\test-*.jar lib