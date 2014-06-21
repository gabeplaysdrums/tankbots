function __dispatch__(data)
{
    if (typeof "__update__" !== "undefined")
    {
        try 
        {
            return __update__(data.tank, data.friends, data.enemies);
        }
        catch(ex)
        {
        }
    }

    return null;
}
