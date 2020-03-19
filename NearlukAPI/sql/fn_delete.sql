CREATE OR REPLACE FUNCTION public.fn_owneragentdelete(
	param_propertyid int,
	param_agentuserid int)
    RETURNS void
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$
begin
delete from owneragent where propertyid=param_propertyid and agentuserid=param_agentuserid;
end
$BODY$;


CREATE OR REPLACE FUNCTION public.fn_post_property_amenities_facilities_delete(
	pid integer)
    RETURNS void
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$

begin
delete from addpropertyamenities where propertyid=pid;
delete from addpropertyfacilities where propertyid=pid;
end

$BODY$;
